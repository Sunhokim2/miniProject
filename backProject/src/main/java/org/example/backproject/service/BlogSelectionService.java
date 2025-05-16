package org.example.backproject.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backproject.dto.NaverBlogItem;
import org.slf4j.Logger; // Slf4j 로거 사용
import org.slf4j.LoggerFactory; // Slf4j 로거 사용

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

// BlogSelectionService.java 또는 SearchController 내의 메소드
public class BlogSelectionService { // 예시 클래스명

    private static final int MAX_CANDIDATES_TO_CONSIDER = 10;
    private static final int TARGET_SELECTION_COUNT = 3;
    private static final int RECENCY_MONTHS_LIMIT = 6;

    public List<NaverBlogItem> selectBlogs(List<NaverBlogItem> fetchedBlogs) {
        if (fetchedBlogs == null || fetchedBlogs.isEmpty()) {
            return new ArrayList<>(); // 원본 리스트가 비어있으면 빈 리스트 반환
        }

        // 상위10개블로그
        List<NaverBlogItem> topNBlogsToConsider = fetchedBlogs.stream()
                .limit(MAX_CANDIDATES_TO_CONSIDER)
                .collect(Collectors.toList());

        List<NaverBlogItem> selectedBlogs = new ArrayList<>();
        List<NaverBlogItem> recentCandidatesWithin6Months = new ArrayList<>();

        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(RECENCY_MONTHS_LIMIT);
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");

        for (NaverBlogItem item : topNBlogsToConsider) {
            try {
                LocalDate postDate = LocalDate.parse(item.getPostdate(), dateFormatter);
                // postDate가 sixMonthsAgo보다 이전이 아니면 (즉, 같거나 이후이면) 조건 만족
                if (!postDate.isBefore(sixMonthsAgo)) {
                    recentCandidatesWithin6Months.add(item);
                }
            } catch (Exception e) {
                // postdate 파싱 실패 시 해당 아이템은 무시하거나 로깅
                }
        }

        // 1차 선정: 6개월 이내 글 중에서 최대 3개 선택 (API 결과 순서대로)
        if (recentCandidatesWithin6Months.size() >= TARGET_SELECTION_COUNT) {
            selectedBlogs.addAll(recentCandidatesWithin6Months.stream()
                    .limit(TARGET_SELECTION_COUNT)
                    .collect(Collectors.toList()));
        } else { // 2차 선정 (Fallback): 6개월 이내 글이 3개 미만일 경우
            // 상위 10개 (topNBlogsToConsider) 중에서 가장 최신 글 1개 선택
            if (!topNBlogsToConsider.isEmpty()) {
                topNBlogsToConsider.stream()
                        .filter(item -> item.getPostdate() != null && !item.getPostdate().isEmpty()) // postdate 유효성 검사
                        .max(Comparator.comparing(item -> LocalDate.parse(item.getPostdate(), dateFormatter)))
                        .ifPresent(selectedBlogs::add); // 가장 최신 글 하나만 추가
            }
        }
        // selectedBlogs에는 이제 0, 1, 또는 3개의 블로그 아이템이 들어있게 됩니다.
        return selectedBlogs;
    }
}