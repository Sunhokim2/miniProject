package org.example.backproject.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // 개발용, 실제 환경에서는 적절한 도메인으로 제한
public class ImageProxyController {

    private static final Logger logger = Logger.getLogger(ImageProxyController.class.getName());
    private final RestTemplate restTemplate;

    public ImageProxyController() {
        this.restTemplate = new RestTemplate();
    }

    @GetMapping("/proxy/image")
    public ResponseEntity<byte[]> proxyImage(@RequestParam String url) {
        logger.info("이미지 프록시 요청: " + url);
        
        try {
            // 외부 이미지 다운로드
            byte[] imageBytes = restTemplate.getForObject(url, byte[].class);
            
            // 응답 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            
            // 이미지 타입 추측 (URL 확장자 기반)
            if (url.toLowerCase().endsWith(".jpg") || url.toLowerCase().endsWith(".jpeg")) {
                headers.setContentType(MediaType.IMAGE_JPEG);
            } else if (url.toLowerCase().endsWith(".png")) {
                headers.setContentType(MediaType.IMAGE_PNG);
            } else if (url.toLowerCase().endsWith(".gif")) {
                headers.setContentType(MediaType.IMAGE_GIF);
            } else {
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            }
            
            // 캐싱 허용 (1일)
            headers.setCacheControl("public, max-age=86400");
            
            logger.info("이미지 프록시 성공: " + url);
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            logger.severe("이미지 프록시 실패: " + url + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(("이미지를 가져올 수 없습니다: " + e.getMessage()).getBytes());
        }
    }
} 