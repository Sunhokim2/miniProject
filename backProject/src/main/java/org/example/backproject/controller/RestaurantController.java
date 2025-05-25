package org.example.backproject.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backproject.dto.RestaurantDto;
import org.example.backproject.entity.Restaurants;
import org.example.backproject.repository.RestaurantsRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
@Slf4j
public class RestaurantController {
    private final RestaurantsRepository restaurantsRepository;

    @GetMapping("/nearby")
    @Transactional(readOnly = true)
    public ResponseEntity<List<RestaurantDto>> getNearbyRestaurants(
        @RequestParam String latitude,
        @RequestParam String longitude,
        @RequestParam double distance
    ) {
        // EntityGraph를 사용하는 메서드 호출
        List<Restaurants> nearbyRestaurants = restaurantsRepository.findNearbyRestaurantsWithGraph(
            latitude, longitude, distance
        );
        
        // DTO로 변환
        List<RestaurantDto> restaurantDtos = nearbyRestaurants.stream()
            .map(RestaurantDto::new)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(restaurantDtos);
    }
    
    /**
     * 레스토랑 이미지 데이터를 바이너리 형태로 제공하는 엔드포인트
     */
    @GetMapping("/{id}/image")
    public ResponseEntity<?> getRestaurantImage(@PathVariable Long id) {
        log.info("레스토랑 이미지 요청: ID = {}", id);
        
        Optional<Restaurants> restaurantOpt = restaurantsRepository.findById(id);
        
        if (restaurantOpt.isPresent()) {
            Restaurants restaurant = restaurantOpt.get();
            
            // 이미지 데이터가 있는 경우
            if (restaurant.getImageData() != null && restaurant.getImageData().length > 0) {
                HttpHeaders headers = new HttpHeaders();
                
                // 이미지 타입 설정 (기본값은 JPEG)
                String contentType = restaurant.getImageType() != null ? 
                                     restaurant.getImageType() : "image/jpeg";
                headers.setContentType(MediaType.parseMediaType(contentType));
                
                // 캐싱 설정 (1일)
                headers.setCacheControl("public, max-age=86400");
                
                // 파일명 설정
                if (restaurant.getImageName() != null) {
                    headers.setContentDispositionFormData("filename", restaurant.getImageName());
                }
                
                log.info("레스토랑 이미지 반환: ID = {}, 크기 = {} 바이트, 타입 = {}", 
                        id, restaurant.getImageData().length, contentType);
                
                return new ResponseEntity<>(restaurant.getImageData(), headers, HttpStatus.OK);
            } 
            // 이미지 URL만 있는 경우 리다이렉트
            else if (restaurant.getImageUrl() != null && !restaurant.getImageUrl().isEmpty()) {
                log.info("이미지 데이터 없음, URL로 리다이렉트: {}", restaurant.getImageUrl());
                HttpHeaders headers = new HttpHeaders();
                headers.setLocation(java.net.URI.create("/api/proxy/image?url=" + 
                                   java.net.URLEncoder.encode(restaurant.getImageUrl(), 
                                                            java.nio.charset.StandardCharsets.UTF_8)));
                return new ResponseEntity<>(headers, HttpStatus.FOUND);
            }
        }
        
        log.warn("레스토랑 이미지 찾을 수 없음: ID = {}", id);
        return ResponseEntity.notFound().build();
    }
} 