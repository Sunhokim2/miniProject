package org.example.backproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.backproject.dto.RestaurantDto;
import org.example.backproject.entity.Restaurants;
import org.example.backproject.repository.RestaurantsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
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
} 