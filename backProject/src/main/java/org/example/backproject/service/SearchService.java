//package org.example.backproject.service;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import jakarta.transaction.Transactional;
//import org.example.backproject.dto.NaverApiResponse;
//import org.example.backproject.dto.NaverBlogItem;
//import org.example.backproject.entity.Restaurants;
//import org.example.backproject.repository.RestaurantsRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestClientException;
//
//import java.time.LocalDate;
//import java.time.format.DateTimeFormatter;
//import java.time.format.DateTimeParseException;
//import java.util.Collections;
//import java.util.List;
//
//@Service
//public class SearchService {
//    private static final Logger log = LoggerFactory.getLogger(SearchService.class);
//
////    아래 4개가 검색용 서비스
//    @Autowired NaverSearchService naverSearchService;
//    @Autowired CrawlingService crawlingService;
//    @Autowired GptApiService gptApiService;
//    @Autowired NaverGeoCodingService naverGeoCodingService;
//
//    @Autowired RestaurantsRepository restaurantsRepository;
//    @Autowired ObjectMapper objectMapper;
//
//    @Transactional
//    public List<Restaurants> processRestaurantSearch(String query) throws JsonProcessingException, RestClientException {
//        String rawJsonResponseFromNaver = naverSearchService.search(query);
//        NaverApiResponse apiResponse = objectMapper.readValue(rawJsonResponseFromNaver, NaverApiResponse.class);
//
//        List<NaverBlogItem> items = (apiResponse != null && apiResponse.getItems() != null)
//                ? apiResponse.getItems()
//                : Collections.emptyList();
//
//        if (items.isEmpty()) {
//            if (rawJsonResponseFromNaver.toLowerCase().contains("\"error\"")) {
//                log.warn("Naver API returned an error: {}", rawJsonResponseFromNaver);
//                // 에러 상황을 호출부에서 처리하도록 예외를 던지거나, 특정 응답 객체를 반환할 수 있습니다.
//                // 여기서는 빈 리스트를 반환하는 대신, 예외를 발생시켜 컨트롤러에서 처리하도록 할 수 있습니다.
//                // 또는, 에러 DTO를 반환할 수도 있습니다. 현재는 빈 리스트로 두겠습니다.
//                // throw new RestClientException("Naver API error: " + rawJsonResponseFromNaver);
//            }
//            log.info("No items found from Naver search for query: {}", query);
//            return Collections.emptyList();
//        }
//
//        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
//        List<NaverBlogItem> sortedItems = items.stream()
//                .filter(item -> isValidPostDate(item, dateFormatter))
//                .sorted(Comparator.comparing((NaverBlogItem item) -> LocalDate.parse(item.getPostdate(), dateFormatter)).reversed())
//                .collect(Collectors.toList());
//
//        List<NaverBlogItem> topItemsToProcess = sortedItems.stream()
//                .limit(1) // 현재 로직대로 1개 아이템 처리
//                .collect(Collectors.toList());
//
//        List<String> linkList = topItemsToProcess.stream()
//                .map(NaverBlogItem::getLink)
//                .filter(Objects::nonNull)
//                .collect(Collectors.toList());
//
//        if (linkList.isEmpty()) {
//            log.info("No valid blog links to process for query: {}", query);
//            return Collections.emptyList();
//        }
//
//        Map<String, String> crawledData = crawlingService.getBlogContent(linkList);
//
//        return crawledData.entrySet().stream()
//                .map(entry -> createOrFetchRestaurantCandidate(entry.getKey(), entry.getValue()))
//                .filter(Objects::nonNull)
//                .collect(Collectors.toList());
//    }
//
//    private boolean isValidPostDate(NaverBlogItem item, DateTimeFormatter formatter) {
//        if (item.getPostdate() == null || item.getPostdate().length() != 8) {
//            log.warn("Postdate '{}' for link '{}' is invalid or null.", item.getPostdate(), item.getLink());
//            return false;
//        }
//        try {
//            LocalDate.parse(item.getPostdate(), formatter);
//            return true;
//        } catch (DateTimeParseException e) {
//            log.warn("Failed to parse postdate '{}' for link '{}'.", item.getPostdate(), item.getLink(), e);
//            return false;
//        }
//    }
//
//    private Restaurants createOrFetchRestaurantCandidate(String blogLink, String blogContent) {
//        try {
//            String gptSummaryJsonString = gptApiService.summarizeBlog(blogContent);
//            String pureJsonString = gptSummaryJsonString.replace("```json\n", "").replace("\n```", "");
//
//            if (pureJsonString == null || pureJsonString.trim().isEmpty()) {
//                log.warn("GPT summary JSON string is empty for blog link: {}", blogLink);
//                return null;
//            }
//
//            GptSummaryDto summaryDto = objectMapper.readValue(pureJsonString, GptSummaryDto.class);
//            if (summaryDto == null || summaryDto.getAddress() == null || summaryDto.getAddress().trim().isEmpty()) {
//                log.warn("GptSummaryDto is null or address is missing for blog link: {}. Skipping.", blogLink);
//                return null;
//            }
//
//            // DB에서 기존 식당 정보 확인
//            Optional<Restaurants> existingRestaurantOpt = restaurantsRepository.findByAddress(summaryDto.getAddress());
//            if (existingRestaurantOpt.isPresent()) {
//                log.info("Restaurant at address '{}' already exists in DB. Using existing entity. Source blog: {}", summaryDto.getAddress(), blogLink);
//                // 기존 엔티티 반환 (이 엔티티는 이미 managed 상태일 수 있음)
//                // 필요하다면 source 업데이트 등의 로직 추가 가능
//                // existingRestaurantOpt.get().setSource(blogLink); // 예시: 출처 업데이트
//                return existingRestaurantOpt.get();
//            } else {
//                log.info("Restaurant at address '{}' does not exist. Creating new entity candidate from blog: {}", summaryDto.getAddress(), blogLink);
//                Restaurants newRestaurant = new Restaurants();
//                newRestaurant.setRestaurant_name(summaryDto.getRestaurant_name());
//                newRestaurant.setAddress(summaryDto.getAddress());
//                newRestaurant.setCategory(summaryDto.getCategory());
//                newRestaurant.setRegion(summaryDto.getRegion());
//                newRestaurant.setMainMenu(summaryDto.getMainMenu() != null ? summaryDto.getMainMenu() : Collections.emptyList());
//                newRestaurant.setBody(summaryDto.getBody());
//                newRestaurant.setRate(summaryDto.getRate());
//                newRestaurant.setSource(blogLink);
//                newRestaurant.setStatus(true); // 기본 상태 true
//
//                // 지오코딩
//                try {
//                    List<String> geoList = naverGeoCodingService.getCoordinates(summaryDto.getAddress());
//                    if (geoList != null && geoList.size() == 2) {
//                        newRestaurant.setLatitude(geoList.get(1)); // 위도
//                        newRestaurant.setLongitude(geoList.get(0)); // 경도
//                        log.info("Geocoded coordinates for {}: {}", summaryDto.getAddress(), geoList);
//                    } else {
//                        log.warn("Could not retrieve/parse coordinates for {}. GeoList: {}", summaryDto.getAddress(), geoList);
//                    }
//                } catch (UnsupportedEncodingException | HttpClientErrorException | RestClientException e) { // 추가
//                    log.error("Geocoding error for address: {}", summaryDto.getAddress(), e);
//                }
//                // 이 시점의 newRestaurant는 아직 DB에 저장되지 않은 상태 (unpersisted)
//                return newRestaurant;
//            }
//        } catch (JsonProcessingException e) {
//            log.error("Error processing GPT summary or DTO for blog link {}: {}", blogLink, e.getMessage(), e);
//            return null;
//        } catch (Exception e) { // GPT API 호출 실패 등 기타 예외
//            log.error("Unexpected error processing entry for blog link {}: {}", blogLink, e.getMessage(), e);
//            return null;
//        }
//    }
//
//}
