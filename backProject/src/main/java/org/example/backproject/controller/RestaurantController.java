package org.example.backproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.backproject.entity.Restaurants;
import org.example.backproject.repository.RestaurantsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {
    private final RestaurantsRepository restaurantsRepository;

    @GetMapping("/nearby")
    public ResponseEntity<List<Restaurants>> getNearbyRestaurants(
        @RequestParam String latitude,
        @RequestParam String longitude,
        @RequestParam double distance
    ) {
        List<Restaurants> nearbyRestaurants = restaurantsRepository.findNearbyRestaurants(
            latitude, longitude, distance
        );
        return ResponseEntity.ok(nearbyRestaurants);
    }
} 