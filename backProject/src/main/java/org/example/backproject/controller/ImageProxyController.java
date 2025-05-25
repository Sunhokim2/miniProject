package org.example.backproject.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.util.Base64;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.net.URL;
import java.net.URLConnection;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // 개발용, 실제 환경에서는 적절한 도메인으로 제한
public class ImageProxyController {

    private static final Logger logger = Logger.getLogger(ImageProxyController.class.getName());
    private final RestTemplate restTemplate;

    public ImageProxyController() {
        // SimpleClientHttpRequestFactory로 타임아웃 설정
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);  // 10초 연결 타임아웃
        factory.setReadTimeout(30000);     // 30초 읽기 타임아웃
        
        RestTemplate template = new RestTemplate(factory);
        this.restTemplate = template;
        
        logger.info("ImageProxyController 초기화 완료 - 타임아웃 설정됨");
    }

    private MediaType detectContentType(String url, byte[] content) {
        // 1. URL의 확장자로 먼저 확인
        String lowercaseUrl = url.toLowerCase();
        if (lowercaseUrl.endsWith(".jpg") || lowercaseUrl.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG;
        } else if (lowercaseUrl.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        } else if (lowercaseUrl.endsWith(".gif")) {
            return MediaType.IMAGE_GIF;
        }
        
        // 2. 파일 매직 넘버로 확인
        if (content.length > 2) {
            if (content[0] == (byte)0xFF && content[1] == (byte)0xD8) {
                return MediaType.IMAGE_JPEG;
            } else if (content[0] == (byte)0x89 && content[1] == (byte)0x50) {
                return MediaType.IMAGE_PNG;
            } else if (content[0] == (byte)0x47 && content[1] == (byte)0x49) {
                return MediaType.IMAGE_GIF;
            }
        }
        
        // 3. 기본값
        return MediaType.IMAGE_JPEG;
    }

    /**
     * 이미지를 Base64로 인코딩하여 Data URI 형태로 반환하는 API
     */
    @GetMapping("/image-to-base64")
    public ResponseEntity<String> imageToBase64(@RequestParam String url) {
        logger.info("이미지 Base64 인코딩 요청 받음: " + url);
        
        try {
            // URL 유효성 검사
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                throw new IllegalArgumentException("유효하지 않은 URL 형식입니다.");
            }
            
            // 네이버와 같은 사이트에서 요구하는 헤더 설정
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
            
            // 엔티티 생성
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            // exchange 메서드 사용해 더 많은 제어 가능
            ResponseEntity<byte[]> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                byte[].class
            );
            
            byte[] imageBytes = response.getBody();
            
            // 응답 데이터 확인
            if (imageBytes == null || imageBytes.length == 0) {
                logger.warning("이미지 데이터가 NULL이거나 비어있습니다: " + url);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("이미지를 찾을 수 없습니다");
            }
            
            logger.info("이미지 다운로드 성공 - URL: " + url + ", 크기: " + imageBytes.length + " bytes");
            
            // 이미지 타입 감지
            MediaType contentType = detectContentType(url, imageBytes);
            
            // Base64로 인코딩
            String base64 = Base64.getEncoder().encodeToString(imageBytes);
            
            // data URI 생성 (예: "data:image/png;base64,...")
            String dataUri = "data:" + contentType + ";base64," + base64;
            
            logger.info("이미지 Base64 인코딩 완료 - URL: " + url);
            
            // CORS 헤더 설정
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.add("Access-Control-Allow-Origin", "*");
            responseHeaders.add("Access-Control-Allow-Methods", "GET, OPTIONS");
            responseHeaders.add("Access-Control-Allow-Headers", "Content-Type");
            responseHeaders.setContentType(MediaType.TEXT_PLAIN);
            
            return new ResponseEntity<>(dataUri, responseHeaders, HttpStatus.OK);
            
        } catch (HttpClientErrorException e) {
            logger.log(Level.SEVERE, "HTTP 클라이언트 오류: " + url, e);
            return ResponseEntity.status(e.getStatusCode())
                    .body("이미지 서버 오류: " + e.getStatusCode().toString());
                    
        } catch (ResourceAccessException e) {
            logger.log(Level.SEVERE, "리소스 접근 오류: " + url, e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("이미지 서버에 접근할 수 없습니다: " + e.getMessage());
                    
        } catch (IllegalArgumentException e) {
            logger.log(Level.SEVERE, "잘못된 URL 형식: " + url, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("잘못된 URL 형식: " + e.getMessage());
                    
        } catch (Exception e) {
            logger.log(Level.SEVERE, "이미지 Base64 인코딩 실패: " + url, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 내부 오류: " + e.getMessage());
        }
    }

    @GetMapping("/proxy/image")
    public ResponseEntity<byte[]> proxyImage(@RequestParam String url) {
        logger.info("이미지 프록시 요청 받음: " + url);
        
        try {
            // URL 유효성 검사
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                throw new IllegalArgumentException("유효하지 않은 URL 형식입니다.");
            }
            
            // 이미지 URL 로깅
            logger.info("프록시 요청 시작 - URL: " + url);
            
            // 네이버와 같은 사이트에서 요구하는 헤더 설정
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
            
            // 엔티티 생성
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            // exchange 메서드 사용해 더 많은 제어 가능
            ResponseEntity<byte[]> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                byte[].class
            );
            
            byte[] imageBytes = response.getBody();
            
            // 응답 데이터 확인
            if (imageBytes == null || imageBytes.length == 0) {
                logger.warning("이미지 데이터가 NULL이거나 비어있습니다: " + url);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("이미지를 찾을 수 없습니다".getBytes());
            }
            
            logger.info("이미지 다운로드 성공 - URL: " + url + ", 크기: " + imageBytes.length + " bytes");
            
            // 응답 헤더 설정
            HttpHeaders responseHeaders = new HttpHeaders();
            
            // CORS 헤더 명시적 설정
            responseHeaders.add("Access-Control-Allow-Origin", "*");
            responseHeaders.add("Access-Control-Allow-Methods", "GET, OPTIONS");
            responseHeaders.add("Access-Control-Allow-Headers", "Content-Type");
            
            // 이미지 타입 감지
            MediaType contentType = detectContentType(url, imageBytes);
            responseHeaders.setContentType(contentType);
            
            // 캐싱 허용 (1일)
            responseHeaders.setCacheControl("public, max-age=86400");
            
            logger.info("이미지 프록시 응답 전송 - URL: " + url + ", Content-Type: " + responseHeaders.getContentType());
            return new ResponseEntity<>(imageBytes, responseHeaders, HttpStatus.OK);
            
        } catch (HttpClientErrorException e) {
            logger.log(Level.SEVERE, "HTTP 클라이언트 오류: " + url, e);
            return ResponseEntity.status(e.getStatusCode())
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("이미지 서버 오류: " + e.getStatusCode().toString()).getBytes());
                    
        } catch (ResourceAccessException e) {
            logger.log(Level.SEVERE, "리소스 접근 오류: " + url, e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("이미지 서버에 접근할 수 없습니다: " + e.getMessage()).getBytes());
                    
        } catch (IllegalArgumentException e) {
            logger.log(Level.SEVERE, "잘못된 URL 형식: " + url, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("잘못된 URL 형식: " + e.getMessage()).getBytes());
                    
        } catch (Exception e) {
            logger.log(Level.SEVERE, "이미지 프록시 요청 실패: " + url, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("서버 내부 오류: " + e.getMessage()).getBytes());
        }
    }
} 