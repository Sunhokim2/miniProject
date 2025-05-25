package org.example.backproject.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.backproject.dto.GptSummaryDto;
import org.example.backproject.dto.NaverApiResponse;
import org.example.backproject.dto.NaverBlogItem;
import org.example.backproject.dto.SearchRequestDto;
import org.example.backproject.entity.Restaurants;
import org.example.backproject.repository.PostsRepository;
import org.example.backproject.repository.RestaurantsRepository;
import org.example.backproject.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;

import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

import org.example.backproject.dto.ImageData;
import org.example.backproject.dto.RestaurantDto;

@RestController
@RequiredArgsConstructor
public class SearchBackController {

    private static final Logger log = LoggerFactory.getLogger(SearchController.class);

    // 테스트용 이미지 URL (Pixabay의 무료 이미지)
    private static final String TEST_IMAGE_URL = "https://cdn.pixabay.com/photo/2017/02/15/10/39/salad-2068220_960_720.jpg";

    @Autowired
    NaverSearchService naverSearchService;
    @Autowired
    ObjectMapper objectMapper;
    @Autowired
    CrawlingService crawlingService;
    @Autowired
    GptApiService gptApiService;
    @Autowired
    RestaurantsRepository restaurantRepository;
    @Autowired
    NaverGeoCodingService naverGeoCodingService;
    @Autowired
    SearchAndPostService searchAndPostService;
    @Autowired
    private PostsRepository postsRepository;
    @Autowired
    private ImageService imageService;

    // 루트 경로 및 검색 실행 경로 모두 이 메소드가 처리
    @PostMapping("/api/search")
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<?> searchRestaurants(@RequestBody SearchRequestDto searchRequest) {
        try {
            String query = searchRequest.getQuery();

            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "검색어(query)는 필수입니다."));
            }

            String rawJsonResponseFromNaver = naverSearchService.search(query);
            if (rawJsonResponseFromNaver == null) {
                return ResponseEntity.ok(Map.of("message", "네이버 검색 결과가 없습니다."));
            }

            NaverApiResponse apiResponse = objectMapper.readValue(rawJsonResponseFromNaver, NaverApiResponse.class);
            if (apiResponse == null || apiResponse.getItems() == null || apiResponse.getItems().isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "검색 결과가 없습니다."));
            }

            List<Restaurants> restaurantEntities; // 처리된 식당 엔티티 리스트

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");

            List<NaverBlogItem> sortedItems = apiResponse.getItems().stream()
                    .sorted(Comparator.comparing((NaverBlogItem item) -> LocalDate.parse(item.getPostdate(), dateFormatter)).reversed())
                    .toList();
            List<NaverBlogItem> topItemsToProcess = sortedItems.stream().limit(1).toList();
            List<String> linkList = topItemsToProcess.stream().map(NaverBlogItem::getLink).filter(Objects::nonNull).collect(Collectors.toList());

            if (linkList.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "처리할 유효한 블로그 링크가 없습니다."));
            }

            Map<String, CrawlingService.BlogContent> crawledData = crawlingService.getBlogContent(linkList);

            restaurantEntities = crawledData.entrySet().stream()
                    .map(entry -> {
                        String blogLink = entry.getKey();
                        CrawlingService.BlogContent blogContent = entry.getValue();
                        String blogText = blogContent.getText();
                        String imageUrl = blogContent.getImageUrl();
                        
                        try {
                            String gptSummaryJsonString = gptApiService.summarizeBlog(blogText);
                            String pureJsonString = gptSummaryJsonString.replace("```json\n", "").replace("\n```", "");

                            if (pureJsonString.trim().isEmpty()) {
                                log.warn("GPT summary JSON string is empty for blog link: {}", blogLink);
                                return null;
                            }

                            GptSummaryDto summaryDto = objectMapper.readValue(pureJsonString, GptSummaryDto.class);
                            if (summaryDto == null || summaryDto.getAddress() == null || summaryDto.getAddress().trim().isEmpty()) {
                                log.warn("GptSummaryDto is null or address is missing for blog link: {}. Skipping.", blogLink);
                                return null;
                            }

                            Optional<Restaurants> existingRestaurantOpt = restaurantRepository.findByAddress(summaryDto.getAddress());
                            if (existingRestaurantOpt.isPresent()) {
                                Restaurants existingRestaurant = existingRestaurantOpt.get();
                                boolean needsUpdate = false;
                                
                                // 기존 레스토랑에 이미지 URL이 없다면 업데이트
                                if ((existingRestaurant.getImageUrl() == null || existingRestaurant.getImageUrl().isEmpty())) {
                                    existingRestaurant.setImageUrl(TEST_IMAGE_URL);
                                    needsUpdate = true;
                                    log.info("테스트용 이미지 URL로 업데이트: {}", TEST_IMAGE_URL);
                                }
                                
                                // 이미지 데이터가 없는 경우에도 이미지 다운로드 시도
                                if (existingRestaurant.getImageBytes() == null || existingRestaurant.getImageBytes().length == 0) {
                                    try {
                                        ImageData imageData = crawlingService.downloadImageFromUrl(TEST_IMAGE_URL);
                                        if (imageData != null) {
                                            byte[] imageBytes = imageData.getData();
                                            log.info("이미지 데이터 디버깅 - 바이트 배열 길이: {}, 타입: {}", 
                                                    imageBytes != null ? imageBytes.length : "null", 
                                                    imageBytes != null ? imageBytes.getClass().getName() : "null");
                                            
                                            if (imageBytes != null && imageBytes.length > 0) {
                                                byte[] copyBytes = new byte[imageBytes.length];
                                                System.arraycopy(imageBytes, 0, copyBytes, 0, imageBytes.length);
                                                existingRestaurant.setImageBytes(copyBytes);
                                                existingRestaurant.setImageName(imageData.getName());
                                                existingRestaurant.setImageType(imageData.getType());
                                                existingRestaurant.setImageSize((long) imageBytes.length);
                                            } else {
                                                log.warn("이미지 바이트 배열이 null이거나 비어있음");
                                                existingRestaurant.setImageBytes(null);
                                                existingRestaurant.setImageName(null);
                                                existingRestaurant.setImageType(null);
                                                existingRestaurant.setImageSize(null);
                                            }
                                            
                                            needsUpdate = true;
                                            log.info("Downloaded and set image data for existing restaurant: {}, size: {} bytes", 
                                                    existingRestaurant.getRestaurant_name(), 
                                                    existingRestaurant.getImageSize());
                                        } else {
                                            log.warn("Failed to download image from URL: {}", TEST_IMAGE_URL);
                                        }
                                    } catch (Exception e) {
                                        log.error("Error downloading image: {}", e.getMessage(), e);
                                    }
                                }
                                
                                if (needsUpdate) {
                                    restaurantRepository.save(existingRestaurant);
                                }
                                
                                return existingRestaurant;
                            } else {
                                log.info("Restaurant at address '{}' does not exist. Creating new entry from blog: {}", summaryDto.getAddress(), blogLink);
                                Restaurants newRestaurant = new Restaurants();
                                newRestaurant.setRestaurant_name(summaryDto.getRestaurant_name());
                                newRestaurant.setAddress(summaryDto.getAddress());
                                newRestaurant.setCategory(summaryDto.getCategory());
                                newRestaurant.setRegion(summaryDto.getRegion());
                                newRestaurant.setMainMenu(summaryDto.getMainMenu());
                                newRestaurant.setBody(summaryDto.getBody());
                                newRestaurant.setRate(summaryDto.getRate());
                                newRestaurant.setSource(blogLink);
                                newRestaurant.setStatus(true);
                                
                                // 이미지 URL 설정 (테스트용 이미지 사용)
                                // 원래 코드: if (imageUrl != null && !imageUrl.isEmpty()) {
                                // 기존 imageUrl 대신 TEST_IMAGE_URL 사용
                                log.info("테스트용 이미지 URL 사용: {}", TEST_IMAGE_URL);
                                newRestaurant.setImageUrl(TEST_IMAGE_URL);
                                
                                // 이미지 다운로드 시도
                                try {
                                    ImageData imageData = crawlingService.downloadImageFromUrl(TEST_IMAGE_URL);
                                    if (imageData != null) {
                                        byte[] imageBytes = imageData.getData();
                                        log.info("이미지 데이터 디버깅 - 바이트 배열 길이: {}, 타입: {}", 
                                                imageBytes != null ? imageBytes.length : "null", 
                                                imageBytes != null ? imageBytes.getClass().getName() : "null");
                                        
                                        if (imageBytes != null && imageBytes.length > 0) {
                                            byte[] copyBytes = new byte[imageBytes.length];
                                            System.arraycopy(imageBytes, 0, copyBytes, 0, imageBytes.length);
                                            newRestaurant.setImageBytes(copyBytes);
                                            newRestaurant.setImageName(imageData.getName());
                                            newRestaurant.setImageType(imageData.getType());
                                            newRestaurant.setImageSize((long) imageBytes.length);
                                        } else {
                                            log.warn("이미지 바이트 배열이 null이거나 비어있음");
                                            newRestaurant.setImageBytes(null);
                                            newRestaurant.setImageName(null);
                                            newRestaurant.setImageType(null);
                                            newRestaurant.setImageSize(null);
                                        }
                                        
                                        log.info("Downloaded and set image data for new restaurant: {}, size: {} bytes", 
                                                summaryDto.getRestaurant_name(), 
                                                newRestaurant.getImageSize());
                                    } else {
                                        log.warn("Failed to download image from URL: {}", TEST_IMAGE_URL);
                                    }
                                } catch (Exception e) {
                                    log.error("Error downloading image: {}", e.getMessage(), e);
                                }

                                try {
                                    List<String> geoList = naverGeoCodingService.getCoordinates(summaryDto.getAddress());
                                    if (geoList != null && geoList.size() == 2) {
                                        newRestaurant.setLatitude(geoList.get(1));
                                        newRestaurant.setLongitude(geoList.get(0));
                                        log.info("Geocoded coordinates for {}: {}", summaryDto.getAddress(), geoList);
                                    } else {
                                        log.warn("Could not retrieve/parse coordinates for {}. GeoList: {}", summaryDto.getAddress(), geoList);
                                    }
                                } catch (UnsupportedEncodingException | RestClientException e) {
                                    log.error("Geocoding error for address: {}", summaryDto.getAddress(), e);
                                }
                                return newRestaurant;
                            }
                        } catch (JsonProcessingException e) {
                            log.error("Error processing GPT summary or DTO for blog link {}: {}", blogLink, e.getMessage(), e);
                            return null;
                        } catch (Exception e) {
                            log.error("Unexpected error processing entry for blog link {}: {}", blogLink, e.getMessage(), e);
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            if (restaurantEntities.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "추출된 식당 정보가 없습니다."));
            }

            //❗❗❗개발용
            Long currentUserId = 1L;

            // 트랜잭션 처리 개선
            try {
                if (restaurantRepository.findByAddress(restaurantEntities.get(0).getAddress()).isEmpty()) {
                    searchAndPostService.CreateRestaurants(restaurantEntities);
                }
                if (postsRepository.findByUserIdAndRestaurantName(currentUserId, restaurantEntities.get(0).getRestaurant_name()).isEmpty()) {
                    searchAndPostService.CreatePosts(restaurantEntities, currentUserId);
                }
                return ResponseEntity.ok(restaurantEntities);
            } catch (Exception e) {
                log.error("DB 저장 중 오류 발생: {}", e.getMessage(), e);
                throw e; // 트랜잭션 롤백을 위해 예외를 다시 던짐
            }

        } catch (JsonProcessingException e) {
            log.error("JSON 처리 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "데이터 처리 중 오류가 발생했습니다."));
        } catch (Exception e) {
            log.error("요청 처리 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "서버 내부 오류가 발생했습니다."));
        }
    }
}