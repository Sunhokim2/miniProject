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

@RestController
@RequiredArgsConstructor
public class SearchBackController {

    private static final Logger log = LoggerFactory.getLogger(SearchController.class);

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

    // 루트 경로 및 검색 실행 경로 모두 이 메소드가 처리
    @PostMapping("/api/search")
    @Transactional
    public ResponseEntity<?> searchRestaurants(
            @RequestBody SearchRequestDto searchRequest) {

        String query = searchRequest.getQuery(); // DTO에서 query 추출

        if (query == null || query.trim().isEmpty()) {
            log.warn("Search query is missing or empty in request body.");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "검색어(query)는 필수입니다. 요청 본문에 'query' 필드를 포함해줘요."));
        }

        String rawJsonResponseFromNaver = naverSearchService.search(query);
        List<Restaurants> restaurantEntities; // 처리된 식당 엔티티 리스트

        try {
            NaverApiResponse apiResponse = objectMapper.readValue(rawJsonResponseFromNaver, NaverApiResponse.class);

            List<NaverBlogItem> items = (apiResponse != null && apiResponse.getItems() != null)
                    ? apiResponse.getItems()
                    : Collections.emptyList();

            if (items.isEmpty()) {
                if (rawJsonResponseFromNaver.toLowerCase().contains("\"error\"")) {
                    try {
                        Object naverError = objectMapper.readValue(rawJsonResponseFromNaver, Object.class);
                        return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body(naverError);
                    } catch (JsonProcessingException e) {
                        log.warn("Failed to parse Naver error response as JSON: {}", rawJsonResponseFromNaver);
                        return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body(Map.of("error", "Naver API error", "details", rawJsonResponseFromNaver));
                    }
                }
                return ResponseEntity.ok(Map.of("message", "검색 결과가 없습니다."));
            }

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");

            List<NaverBlogItem> sortedItems = items.stream()
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

//                            이미 있는거 리턴하는것으로 끝냄
                            Optional<Restaurants> existingRestaurantOpt = restaurantRepository.findByAddress(summaryDto.getAddress());
                            if (existingRestaurantOpt.isPresent()) {
                                Restaurants existingRestaurant = existingRestaurantOpt.get();
                                // 기존 레스토랑에 이미지 URL이 없다면 업데이트
                                if ((existingRestaurant.getImageUrl() == null || existingRestaurant.getImageUrl().isEmpty()) && 
                                    imageUrl != null && !imageUrl.isEmpty()) {
                                    existingRestaurant.setImageUrl(imageUrl);
                                    restaurantRepository.save(existingRestaurant);
                                    log.info("Updated image URL for existing restaurant at address '{}'. Source blog: {}", summaryDto.getAddress(), blogLink);
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
                                
                                // 이미지 URL 설정
                                if (imageUrl != null && !imageUrl.isEmpty()) {
                                    newRestaurant.setImageUrl(imageUrl);
                                    log.info("Set image URL for new restaurant at address '{}': {}", summaryDto.getAddress(), imageUrl);
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
//          여기까지 restaurants에 api검색으로 이미있다면 기존 DB에서 불러오고 아니라면 api로 생성한걸 넣는 리스트 생성
//            현재는 1개만 되도록 되어있고 api검색으로 나온 address로 비교를해서 DB에 있는 유무를 따집니다.
//            있다면 기존의 DB에서 꺼낸걸 리턴함

            if (restaurantEntities.isEmpty()) {
                return ResponseEntity.ok(Map.of("message", "추출된 식당 정보가 없습니다."));
            }

//            ❗❗❗개발용
            Long currentUserId = 1L;

//            실제 DB에 적재하는 서비스( Transaction )
//            1. 만약 레스토랑 DB에 비어있다면 DB적재
            if (restaurantRepository.findByAddress(restaurantEntities.get(0).getAddress()).isEmpty()) {
                searchAndPostService.CreateRestaurants(restaurantEntities);
            }
//            2. 만약 posts DB 비어있다면 DB적재
            if (postsRepository.findByUserIdAndRestaurantName(currentUserId, restaurantEntities.get(0).getRestaurant_name()).isEmpty()) {
                searchAndPostService.CreatePosts(restaurantEntities, currentUserId);
            }

//            레스토랑 리스트를 리턴(현재는 1개 요소)
            return ResponseEntity.ok(restaurantEntities);

        } catch (JsonProcessingException e) {
            log.error("Naver API 응답 처리 중 JSON 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "결과 처리 중 오류가 발생했습니다."));
        } catch (RestClientException e) {
            log.error("외부 API 호출 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body(Map.of("error", "외부 서비스 연동 중 오류가 발생했습니다."));
        } catch (Exception e) {
            log.error("요청 처리 중 알 수 없는 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "서버 내부 오류가 발생했습니다."));
        }
    }
}