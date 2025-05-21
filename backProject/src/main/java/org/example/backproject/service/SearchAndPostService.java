package org.example.backproject.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backproject.entity.Posts;
import org.example.backproject.entity.Restaurants;
import org.example.backproject.repository.PostsRepository;
import org.example.backproject.repository.RestaurantsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SearchAndPostService {
    private static final Logger log = LoggerFactory.getLogger(SearchAndPostService.class);

    private final RestaurantsRepository restaurantsRepository;
    private final PostsRepository postsRepository;

    @Transactional
    public void CreateRestaurants(
            List<Restaurants> restaurantEntities
    ) {
        if (restaurantEntities == null || restaurantEntities.isEmpty()) {
            return;
        }
        // 1. Restaurants 저장 (이미 컨트롤러 레벨에서 생성/조회 후 넘어왔다고 가정, 또는 여기서 처리)
        List<Restaurants> savedOrUpdatedRestaurants = restaurantsRepository.saveAll(restaurantEntities);
        log.info("{} restaurant entries processed (saved/updated) in DB.", savedOrUpdatedRestaurants.size());

    }

    @Transactional // 여러 DB 작업을 하나의 트랜잭션으로 묶음
    public List<Restaurants> CreatePosts(
            List<Restaurants> restaurantEntities,
            Long userId
    ) {
        if (restaurantEntities == null || restaurantEntities.isEmpty()) {
            return List.of();
        }

        // 2. Posts 저장 (중복저장방지)
        for (Restaurants restaurant : restaurantEntities) {

            String restaurantNameForCheck = restaurant.getRestaurant_name();
            Optional<Posts> post = postsRepository.findByUserIdAndRestaurantName(userId, restaurantNameForCheck);
            if (post.isEmpty()) {
                log.info("포스트 user_id: {} 그리고 restaurant_name: '{}' with visited=true already exists. Skipping.", userId, restaurantNameForCheck);
                Posts newPost = new Posts(userId, restaurant);

                newPost.setLatitude(restaurant.getLatitude());
                newPost.setLongitude(restaurant.getLongitude());
                newPost.setRestaurantName(restaurant.getRestaurant_name());

                postsRepository.save(newPost);
                log.info("Saved post for user_id: {} and restaurant_id: {}", userId, restaurant.getId());
            } else {
                log.info("이미 존재합니다.");
            }

        }
        return restaurantEntities;
    }
}