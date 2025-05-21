package org.example.backproject.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backproject.dto.GptSummaryDto;
import org.example.backproject.dto.NaverApiResponse;
import org.example.backproject.dto.NaverBlogItem;
import org.example.backproject.entity.Restaurants;
import org.example.backproject.repository.RestaurantsRepository;
import org.example.backproject.service.CrawlingService;
import org.example.backproject.service.GptApiService;
import org.example.backproject.service.NaverGeoCodingService;
import org.example.backproject.service.NaverSearchService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;

import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class SearchController {
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

    // 루트 경로 및 검색 실행 경로 모두 이 메소드가 처리
    @GetMapping("/")
    @Transactional
    public String searchPage(
            @RequestParam(value = "query", required = false) String query,
            Model model) {
        model.addAttribute("searchQuery", query); // 현재 검색어 (있다면)

        if (query != null && !query.trim().isEmpty()) {
            String rawJsonResponseFromNaver = naverSearchService.search(query); // 기본 5개 결과 요청

            try {
                NaverApiResponse apiResponse = objectMapper.readValue(rawJsonResponseFromNaver, NaverApiResponse.class);
                List<NaverBlogItem> items = (apiResponse != null && apiResponse.getItems() != null)
                        ? apiResponse.getItems()
                        : Collections.emptyList();

                if (!items.isEmpty()) {
                    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");

                    // 1. 유효한 날짜를 가진 아이템 필터링 및 최신순 정렬
                    List<NaverBlogItem> sortedItems = items.stream()
                            .filter(item -> { // postdate 유효성 검사 및 파싱 가능 여부 확인
                                if (item.getPostdate() == null || item.getPostdate().length() != 8) {
                                    log.warn("게시물 링크 '{}'의 postdate '{}' 형식이 유효하지 않거나 null입니다.", item.getLink(), item.getPostdate());
                                    return false;
                                }
                                try {
                                    LocalDate.parse(item.getPostdate(), dateFormatter);
                                    return true;
                                } catch (DateTimeParseException e) {
                                    log.warn("게시물 링크 '{}'의 postdate '{}' 파싱 실패.", item.getLink(), item.getPostdate(), e);
                                    return false;
                                }
                            })
                            .sorted((item1, item2) -> {
                                // 위 filter에서 파싱 가능성이 검증되었으므로, 여기서의 예외 발생 가능성은 매우 낮음
                                LocalDate date1 = LocalDate.parse(item1.getPostdate(), dateFormatter);
                                LocalDate date2 = LocalDate.parse(item2.getPostdate(), dateFormatter);
                                return date2.compareTo(date1); // 최신 날짜가 먼저 오도록 (내림차순)
                            })
                            .toList();


                    List<NaverBlogItem> top3Items = sortedItems.stream()
                            .limit(1)
                            .toList();

                    // 3. 요청된 필드(title, link, bloggername, postdate)만 추출하여 새로운 리스트 생성
                    List<Map<String, String>> processedResults = top3Items.stream()
                            .map(item -> Map.of(
                                    "title", item.getTitle() != null ? item.getTitle() : "",
                                    "link", item.getLink() != null ? item.getLink() : "",
                                    "bloggername", item.getBloggername() != null ? item.getBloggername() : "",
                                    "postdate", item.getPostdate() != null ? item.getPostdate() : ""
                            ))
                            .toList();

//                    링크만 뽑아서 주기 (3개)
                    List<String> linkList = processedResults.stream()  // processedResults 리스트를 스트림으로 변환
                            .map(map -> map.get("link"))               // 각 맵에서 "link" 키의 값을 추출
                            .collect(Collectors.toList());

//                    4. 링크리스트를 크롤링으로 넘기기 (크롤링 결과는 <링크 , 내용>)
                    Map<String, String> crawledData = crawlingService.getBlogContent(linkList);


//                    5. crawledData를 gpt api를 통해 분류 및 요약
                    List<Restaurants> restaurantEntities = crawledData.entrySet().stream()
                            .map(entry -> {
                                String blogLink = entry.getKey();
                                String blogContent = entry.getValue();

                                String gptSummaryJsonString;


                                // 1. json으로 받기
                                gptSummaryJsonString = gptApiService.summarizeBlog(blogContent);
                                // 마크다운 코드 블록 제거
                                String pureJsonString = gptSummaryJsonString.replace("```json\n", "").replace("\n```", "");


                                if (pureJsonString == null || pureJsonString.trim().isEmpty()) {
                                    return null; // 다음 처리를 위해 null 반환
                                }


                                // 2. DTO로 파싱
                                GptSummaryDto summaryDto = null;
                                try {
                                    summaryDto = objectMapper.readValue(pureJsonString, GptSummaryDto.class);
                                } catch (JsonProcessingException e) {
                                    throw new RuntimeException(e);
                                }


                                // 3. Restaurants로 옮기기
//                                중복방지
                                Optional<Restaurants> AddressOpt = restaurantRepository.findByAddress(summaryDto.getAddress());

                                if (AddressOpt.isPresent()) {
                                    System.out.println("예 존재해요.");
                                    // 이미 존재할 경우의 로직 처리 (예: 사용자에게 알림, 기존 정보 사용 등)
//                                    return AddressOpt.get();

                                    model.addAttribute("searchResultsJson","이미 DB에 있음\n"+ AddressOpt.get().getBody());
                                    return null;
                                } else {
                                    System.out.println("존재안함");
                                    // 존재하지 않을 경우의 로직 처리 (예: 새로운 Restaurants 엔티티 생성 및 저장)
                                    Restaurants restaurant = new Restaurants();
                                    restaurant.setRestaurant_name(summaryDto.getRestaurant_name());
                                    restaurant.setAddress(summaryDto.getAddress());
                                    restaurant.setCategory(summaryDto.getCategory());
                                    restaurant.setRegion(summaryDto.getRegion());
                                    restaurant.setMainMenu(summaryDto.getMainMenu());
                                    restaurant.setBody(summaryDto.getBody());
                                    restaurant.setRate(summaryDto.getRate());


                                    // Geocode the address to retrieve latitude and longitude
                                    List<String> geoList = null;

                                    try {
                                        geoList = naverGeoCodingService.getCoordinates(summaryDto.getAddress());
                                    } catch (UnsupportedEncodingException e) {
                                        throw new RuntimeException(e);
                                    }

                                    if (geoList != null && geoList.size() == 2) {
                                        restaurant.setLatitude(geoList.get(1)); // 위도
                                        restaurant.setLongitude(geoList.get(0)); //경도
                                        System.out.println("geoList : " + geoList);
                                    }

//                                주소랑 상태넣기
                                    restaurant.setSource(blogLink);
                                    restaurant.setStatus(true);

                                    return restaurant; // 변환된 Restaurants 엔티티 반환
                                }
                            }).filter(Objects::nonNull) // 이 필터를 유지하거나 추가하세요.
                            .collect(Collectors.toList());


//                    6. DB에 넣기 ()
                    if (!restaurantEntities.isEmpty()) {
                        try {
                            List<Restaurants> savedRestaurants = restaurantRepository.saveAll(restaurantEntities);
                            log.info("{}개의 음식점 정보가 DB에 성공적으로 저장되었습니다.", savedRestaurants.size());
                            // 저장된 엔티티 (ID 포함)를 모델에 추가하거나 다른 용도로 사용
                            String finalJsonToDisplay = objectMapper
                                    .writerWithDefaultPrettyPrinter()
                                    .writeValueAsString(savedRestaurants); // 저장된 엔티티를 JSON으로 변환

                            model.addAttribute("searchResultsJson", finalJsonToDisplay);

                        } catch (Exception e) { // 저장 중 발생할 수 있는 모든 예외 처리
                            log.error("DB에 음식점 정보 저장 중 오류 발생", e);
                            model.addAttribute("searchResultsJson", "{\"error\":\"DB 저장 중 오류가 발생했습니다.\"}");
                        }
                    }


                } else {
                    // 네이버 서비스에서 오류 JSON을 반환했거나, items가 비어있는 경우
                    if (rawJsonResponseFromNaver.toLowerCase().contains("\"error\"")) {
                        model.addAttribute("searchResultsJson", rawJsonResponseFromNaver); // 네이버 오류 메시지 그대로 표시
                    } else {
                        model.addAttribute("searchResultsJson", "{\"message\":\"검색 결과가 없습니다.\"}");
                    }
                }

            } catch (JsonProcessingException e) {
                log.error("네이버 API 응답 처리 중 JSON 오류 발생: {}", e.getMessage(), e);
                model.addAttribute("searchResultsJson", "{\"error\":\"결과 처리 중 오류가 발생했습니다.\"}");
            }
        } else {
            model.addAttribute("searchResultsJson", null); // 검색어가 없으면 결과도 없음
        }


        return "search";
    }
}