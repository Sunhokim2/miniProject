package org.example.backproject.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.example.backproject.dto.ImageData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URL;
import java.util.Arrays;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {
    private static final Logger logger = LoggerFactory.getLogger(ImageService.class);
    
    /**
     * URL에서 이미지를 다운로드하여 byte 배열로 반환
     */
    public ImageData downloadImage(String imageUrl) {
        try {
            // URL 유효성 검사
            if (imageUrl == null || imageUrl.isEmpty() || 
                (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://"))) {
                logger.warn("유효하지 않은 이미지 URL: {}", imageUrl);
                return null;
            }

            // HTTP 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
            headers.set("Referer", "https://search.naver.com/");
            headers.set("Accept", "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8");
            headers.set("Accept-Language", "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7");
            headers.set("sec-ch-ua", "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"");
            headers.set("sec-ch-ua-mobile", "?0");
            headers.set("sec-ch-ua-platform", "\"Windows\"");
            headers.set("sec-fetch-dest", "image");
            headers.set("sec-fetch-mode", "no-cors");
            headers.set("sec-fetch-site", "cross-site");
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            // RestTemplate 설정
            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(10000);
            factory.setReadTimeout(30000);
            RestTemplate restTemplate = new RestTemplate(factory);
            
            // 이미지 다운로드
            ResponseEntity<byte[]> response = restTemplate.exchange(
                imageUrl, HttpMethod.GET, entity, byte[].class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                ImageData imageData = new ImageData();
                byte[] responseBody = response.getBody();
                
                // 상세 디버깅 정보 추가
                logger.info("다운로드한 이미지 바이트 배열 확인 - 길이: {}, 타입: {}, 첫 10바이트: {}", 
                    responseBody.length, 
                    responseBody.getClass().getName(),
                    responseBody.length > 10 ? Arrays.toString(Arrays.copyOf(responseBody, 10)) : "전체 배열이 10바이트보다 작음");
                
                // 방어적 복사 - 원본 바이트 배열의 복사본 만들기
                byte[] dataCopy = responseBody.clone();
                imageData.setData(dataCopy);
                
                // 이미지 타입 감지
                String contentType = detectContentType(imageUrl, responseBody);
                imageData.setType(contentType);
                
                // 파일명 생성 (URL에서 추출 또는 UUID 생성)
                String fileName = extractFileName(imageUrl);
                imageData.setName(fileName);
                
                // 이미지 크기 설정 (바이트 배열 길이)
                Long fileSize = (long) responseBody.length;
                imageData.setSize(fileSize);
                
                // 생성된 ImageData 객체 검증
                byte[] returnedData = imageData.getData();
                if (returnedData == null) {
                    logger.error("심각한 오류: 생성된 ImageData 객체의 getData()가 null을 반환");
                    return null;
                }
                
                if (!(returnedData instanceof byte[])) {
                    logger.error("심각한 오류: ImageData.getData()가 byte[] 타입이 아님: {}", returnedData.getClass().getName());
                    return null;
                }
                
                logger.info("이미지 다운로드 성공: {}, 크기: {}바이트, 타입: {}, getData() 반환 타입: {}, 실제 타입: {}", 
                           imageUrl, 
                           imageData.getSize(), 
                           imageData.getType(), 
                           imageData.getData() != null ? imageData.getData().getClass().getName() : "null",
                           imageData.getData() != null ? imageData.getData().getClass() : "null");
                
                return imageData;
            } else {
                logger.warn("이미지 다운로드 실패 - HTTP 응답: {}, URL: {}", 
                           response.getStatusCode(), imageUrl);
            }
        } catch (Exception e) {
            logger.error("이미지 다운로드 실패: {}", imageUrl, e);
        }
        
        return null;
    }
    
    /**
     * 이미지 URL에서 파일명 추출
     */
    private String extractFileName(String imageUrl) {
        try {
            String fileName = new URL(imageUrl).getPath();
            int lastSlashIndex = fileName.lastIndexOf('/');
            if (lastSlashIndex >= 0) {
                fileName = fileName.substring(lastSlashIndex + 1);
            }
            
            // 파일명에서 쿼리 파라미터 제거
            int queryIndex = fileName.indexOf('?');
            if (queryIndex > 0) {
                fileName = fileName.substring(0, queryIndex);
            }
            
            if (fileName.isEmpty() || fileName.length() < 3) {
                // 파일명이 추출되지 않거나 너무 짧으면 UUID 생성
                fileName = UUID.randomUUID().toString() + getExtensionFromContentType(detectContentType(imageUrl, null));
            }
            
            return fileName;
        } catch (Exception e) {
            return UUID.randomUUID().toString() + ".jpg";
        }
    }
    
    /**
     * 콘텐츠 타입에서 파일 확장자 추출
     */
    private String getExtensionFromContentType(String contentType) {
        if (contentType.contains("jpeg") || contentType.contains("jpg")) {
            return ".jpg";
        } else if (contentType.contains("png")) {
            return ".png";
        } else if (contentType.contains("gif")) {
            return ".gif";
        } else {
            return ".jpg"; // 기본값
        }
    }
    
    /**
     * 이미지 타입 감지
     */
    private String detectContentType(String url, byte[] content) {
        // 확장자로 판단
        if (url != null) {
            String lowercaseUrl = url.toLowerCase();
            if (lowercaseUrl.endsWith(".jpg") || lowercaseUrl.endsWith(".jpeg")) {
                return "image/jpeg";
            } else if (lowercaseUrl.endsWith(".png")) {
                return "image/png";
            } else if (lowercaseUrl.endsWith(".gif")) {
                return "image/gif";
            }
        }
        
        // 매직 넘버로 판단
        if (content != null && content.length > 2) {
            if (content[0] == (byte)0xFF && content[1] == (byte)0xD8) {
                return "image/jpeg";
            } else if (content[0] == (byte)0x89 && content[1] == (byte)0x50) {
                return "image/png";
            } else if (content[0] == (byte)0x47 && content[1] == (byte)0x49) {
                return "image/gif";
            }
        }
        
        return "image/jpeg"; // 기본값
    }
}

// 내부 ImageData 클래스 삭제 (별도 파일로 분리됨) 