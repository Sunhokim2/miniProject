package org.example.backproject.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class NaverSearchService {

    @Value("${naver.client.id}")
    private String naverClientId;

    @Value("${naver.client.secret}")
    private String naverClientSecret;

    // 기본 검색 파라미터 (필요에 따라 외부 설정 또는 메소드 파라미터로 변경 가능)
    private static final String DEFAULT_DISPLAY = "10"; // 한 번에 표시할 검색 결과 개수
    private static final String DEFAULT_START = "1";    // 검색 시작 위치
    private static final String DEFAULT_SORT = "sim";   // 정렬 옵션: sim (유사도순), date (날짜순)
    private static final String BLOG_SEARCH_API_URL = "https://openapi.naver.com/v1/search/blog.json";

    public String search(String query) {
        if (query == null || query.trim().isEmpty()) {
            log.warn("검색어가 비어있습니다.");
            return "{\"error\":\"검색어를 입력해주세요.\"}";
        }

        String encodedQuery;
        try {
            encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            log.error("검색어 UTF-8 인코딩 실패: query='{}'", query, e);
            return "{\"error\":\"검색어 인코딩 실패: " + e.getMessage() + "\"}";
        }

        String apiUrl = BLOG_SEARCH_API_URL +
                "?query=" + encodedQuery +
                "&display=" + DEFAULT_DISPLAY +
                "&start=" + DEFAULT_START +
                "&sort=" + DEFAULT_SORT;

        log.info("네이버 API 요청 URL: {}", apiUrl);
        // 실제 운영 환경에서는 클라이언트 시크릿을 로그에 남기지 않도록 주의합니다.


        // 요청 헤더 설정
        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("X-Naver-Client-Id", naverClientId);
        requestHeaders.put("X-Naver-Client-Secret", naverClientSecret);

        return executeGetRequest(apiUrl, requestHeaders);
    }

    private String executeGetRequest(String apiUrlString, Map<String, String> requestHeaders) {
        HttpURLConnection con = null;
        try {
            con = connect(apiUrlString);
            con.setRequestMethod("GET"); // HTTP GET 요청 방식 설정

            // 연결 및 읽기 시간 초과 설정 (밀리초 단위)
            con.setConnectTimeout(5000); // 5초
            con.setReadTimeout(5000);    // 5초

            // 요청 헤더 적용
            for (Map.Entry<String, String> header : requestHeaders.entrySet()) {
                con.setRequestProperty(header.getKey(), header.getValue());
            }

            int responseCode = con.getResponseCode(); // API 응답 코드 받기
            if (responseCode == HttpURLConnection.HTTP_OK) { // 정상 응답 (200)
                return readBody(con.getInputStream(), false);
            } else { // 오류 응답
                String errorBody = readBody(con.getErrorStream(), true);
                log.error("네이버 API 오류 발생. URL: {}, 응답 코드: {}, 오류 내용: {}", apiUrlString, responseCode, errorBody);
                // 네이버 오류 응답도 JSON 형태일 수 있으므로, 그대로 반환하거나 파싱하여 가공할 수 있습니다.
                return "{\"error\":\"네이버 API 호출 오류\", \"code\":" + responseCode + ", \"details\":" + errorBody + "}";
            }
        } catch (IOException e) { // 네트워크 오류 등
            log.error("API 요청 중 IO 오류 발생. URL: {}. 오류 메시지: {}", apiUrlString, e.getMessage(), e);
            return "{\"error\":\"API 요청 중 IO 오류 발생: " + e.getMessage() + "\"}";
        } catch (RuntimeException e) { // connect 메소드에서 발생할 수 있는 RuntimeException
            log.error("API 요청 중 내부 오류 발생. URL: {}. 오류 메시지: {}", apiUrlString, e.getMessage(), e);
            return "{\"error\":\"API 요청 중 내부 오류 발생: " + e.getMessage() + "\"}";
        } finally {
            if (con != null) {
                con.disconnect(); // 연결 종료
            }
        }
    }

    private HttpURLConnection connect(String apiUrlString) {
        try {
            URL url = new URL(apiUrlString);
            return (HttpURLConnection) url.openConnection();
        } catch (MalformedURLException e) {
            log.error("API URL 형식이 잘못되었습니다: {}", apiUrlString, e);
            throw new RuntimeException("API URL 형식이 잘못되었습니다: " + apiUrlString, e);
        } catch (IOException e) {
            log.error("API 연결 실패: {}", apiUrlString, e);
            throw new RuntimeException("API 연결 실패: " + apiUrlString, e);
        }
    }

    private String readBody(InputStream body, boolean isErrorStream) {
        if (body == null) {
            log.warn("응답 본문 InputStream이 null입니다. isErrorStream: {}", isErrorStream);
            return isErrorStream ? "{\"message\":\"오류 응답 본문이 없습니다.\"}" : "{\"message\":\"정상 응답 본문이 없습니다.\"}";
        }

        // try-with-resources 구문을 사용하여 자원 자동 해제
        try (InputStreamReader streamReader = new InputStreamReader(body, StandardCharsets.UTF_8);
             BufferedReader lineReader = new BufferedReader(streamReader)) {

            StringBuilder responseBody = new StringBuilder();
            String line;
            while ((line = lineReader.readLine()) != null) {
                responseBody.append(line);
            }
            String result = responseBody.toString();
            // 오류 스트림인데 내용이 비어있을 경우를 위한 추가 처리
            if (result.isEmpty() && isErrorStream) {
                return "{\"message\":\"오류 응답 본문이 비어있습니다.\"}";
            }
            return result;
        } catch (IOException e) {
            log.error("API 응답 본문을 읽는 중 IO 오류 발생. isErrorStream: {}", isErrorStream, e);
            return "{\"error\":\"API 응답 본문 읽기 실패: " + e.getMessage() + "\"}";
        }
    }
}