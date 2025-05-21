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

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchAndPostService {
    private static final Logger log = LoggerFactory.getLogger(SearchAndPostService.class);

    private final RestaurantsRepository restaurantsRepository;
    private final PostsRepository postsRepository;

    @Transactional // 여러 DB 작업을 하나의 트랜잭션으로 묶음
    public List<Restaurants> processSearchAndCreatePosts(
            List<Restaurants> processedRestaurantEntities,
            Long userId
    ) {
        if (processedRestaurantEntities == null || processedRestaurantEntities.isEmpty()) {
            return List.of();
        }

        // 1. Restaurants 저장 (이미 컨트롤러 레벨에서 생성/조회 후 넘어왔다고 가정, 또는 여기서 처리)
        List<Restaurants> savedOrUpdatedRestaurants = restaurantsRepository.saveAll(processedRestaurantEntities);
        log.info("{} restaurant entries processed (saved/updated) in DB.", savedOrUpdatedRestaurants.size());

        if (userId == null) {
            log.warn("User ID is null. Cannot save posts.");
            return savedOrUpdatedRestaurants; // 식당 정보는 반환하되, post는 저장 안함
        }

        // 2. Posts 저장
        for (Restaurants restaurant : savedOrUpdatedRestaurants) {
            // 이미 해당 유저가 해당 식당을 post로 저장했는지 중복 체크 로직 (컨트롤러에서 처리할것)
            // if (postsRepository.existsByUserIdAndRestaurantId(userId, restaurant.getId())) {
            //    log.info("Post for user_id: {} and restaurant_id: {} already exists. Skipping.", userId, restaurant.getId());
            //    continue;
            // }
            Posts newPost = new Posts(userId, restaurant);
            postsRepository.save(newPost);
            log.info("Saved post for user_id: {} and restaurant_id: {}", userId, restaurant.getId());
        }
        return savedOrUpdatedRestaurants;
    }
}