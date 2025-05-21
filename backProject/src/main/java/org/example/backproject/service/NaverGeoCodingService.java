package org.example.backproject.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backproject.dto.GptSummaryDto;
import org.example.backproject.dto.map.NaverGeocodeResponseDto;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class NaverGeoCodingService {

//    address->x(경도),y(위도)
    @Value("${naver.map.client-id}")
    private String naverApiClientId;

    @Value("${naver.map.client-secret}")
    private String naverApiClientSecret;

    private static final String NAVER_GEOCODE_API_URL =
            "https://maps.apigw.ntruss.com/map-geocode/v2/geocode";

    RestTemplate restTemplate = new RestTemplate();
    ObjectMapper objectMapper = new ObjectMapper();

    private static final Logger logger = LoggerFactory.getLogger(NaverGeoCodingService.class);

    public List<String> getCoordinates(String query) throws UnsupportedEncodingException {
        // 1. 입력된 query 값 로깅 및 유효성 검사
        logger.info("지오코딩 요청 주소 (원본): '{}'", query);
        if (!StringUtils.hasText(query)) { // query가 null이거나, 비어있거나, 공백만 있는지 확인
            logger.warn("입력된 주소(query)가 비어있거나 유효하지 않습니다.");
            return Collections.emptyList(); // 빈 리스트 반환
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-ncp-apigw-api-key-id", naverApiClientId);
        headers.set("x-ncp-apigw-api-key", naverApiClientSecret);
        headers.set("Accept", "application/json"); // 응답 형식을 JSON으로 기대함을 명시


        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(NAVER_GEOCODE_API_URL)
                .queryParam("query", URLEncoder.encode(query.trim(),"utf-8")); // query 양쪽 공백 제거

        String requestUrl = NAVER_GEOCODE_API_URL + "?query=" + query;
        logger.info("네이버 지오코딩 API 요청 URL: {}", requestUrl); // 2. 최종 요청 URL 로깅

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    requestUrl, // 수정된 URL 사용
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            logger.info("네이버 지오코딩 API 응답 상태 코드: {}", response.getStatusCode());
            logger.debug("네이버 지오코딩 API 응답 본문: {}", response.getBody());


            Map<String, Object> responseMap = objectMapper.readValue(response.getBody(), new TypeReference<>() {});
            System.out.println( response);
            if ("OK".equals(responseMap.get("status"))) {
                List<Map<String, Object>> addresses = (List<Map<String, Object>>) responseMap.get("addresses");
                if (addresses != null && !addresses.isEmpty()) {
                    Map<String, Object> firstAddress = addresses.get(0);
                    String x = (String) firstAddress.get("x");
                    String y = (String) firstAddress.get("y");

                    if (x != null && y != null) {
                        List<String> coordinates = new ArrayList<>();
                        coordinates.add(x);
                        coordinates.add(y);
                        return coordinates;
                    } else {
                        logger.warn("x 또는 y 좌표값이 null입니다. 주소: {}", query);
                    }
                } else {
                    logger.info("주소에 대한 지오코딩 결과가 없습니다: {}", query);
                }
            } else {
                String errorCode = (String) responseMap.get("status");
                String errorMessage = (String) responseMap.getOrDefault("errorMessage", "알 수 없는 API 오류");
                logger.error("지오코딩 API 오류 응답: Status Code '{}', Error Message '{}' (쿼리: {})", errorCode, errorMessage, query);
            }

        } catch (HttpClientErrorException e) {
            logger.error("지오코딩 API 호출 중 클라이언트 오류 발생 (쿼리: {}): {} - 응답 본문: {}", query, e.getStatusCode(), e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            logger.error("지오코딩 처리 중 예외 발생 (쿼리: {}): {}", query, e.getMessage(), e);
        }

        return Collections.emptyList();
    }
}