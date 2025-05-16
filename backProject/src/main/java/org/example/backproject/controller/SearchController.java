package org.example.backproject.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backproject.dto.NaverApiResponse;
import org.example.backproject.dto.NaverBlogItem;
import org.example.backproject.service.NaverSearchService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class SearchController {
    @Autowired
    NaverSearchService naverSearchService;
    @Autowired
    ObjectMapper objectMapper;
    private static final Logger log = LoggerFactory.getLogger(SearchController.class);


    // 루트 경로 및 검색 실행 경로 모두 이 메소드가 처리
    @GetMapping("/")
    public String searchPage(
            @RequestParam(value = "query", required = false) String query,
            Model model) {
        model.addAttribute("searchQuery", query); // 현재 검색어 (있다면)

        if (query != null && !query.trim().isEmpty()) {
            String rawJsonResponseFromNaver = naverSearchService.search(query); // 기본 10개 결과 요청

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
                                } catch (   DateTimeParseException e) {
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
                            .collect(Collectors.toList());


                    List<NaverBlogItem> top3Items = sortedItems.stream()
                            .limit(3)
                            .collect(Collectors.toList());

                    // 3. 요청된 필드(title, link, bloggername, postdate)만 추출하여 새로운 리스트 생성
                    List<Map<String, String>> processedResults = top3Items.stream()
                            .map(item -> Map.of(
                                    "title", item.getTitle() != null ? item.getTitle() : "",
                                    "link", item.getLink() != null ? item.getLink() : "",
                                    "bloggername", item.getBloggername() != null ? item.getBloggername() : "",
                                    "postdate", item.getPostdate() != null ? item.getPostdate() : ""
                                    ))
                            .collect(Collectors.toList());

                    // 4. 모델에 최종 추가
                    String finalJsonToDisplay = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(processedResults);
                    model.addAttribute("searchResultsJson", finalJsonToDisplay);

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