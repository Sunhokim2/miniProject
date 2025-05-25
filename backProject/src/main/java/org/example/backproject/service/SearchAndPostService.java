package org.example.backproject.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backproject.entity.Posts;
import org.example.backproject.entity.Restaurants;
import org.example.backproject.repository.PostsRepository;
import org.example.backproject.repository.RestaurantsRepository;
import org.example.backproject.repository.UsersRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SearchAndPostService {
    private static final Logger log = LoggerFactory.getLogger(SearchAndPostService.class);

    private final RestaurantsRepository restaurantsRepository;
    private final PostsRepository postsRepository;
    private final UsersRepository usersRepository;

    @Transactional(rollbackOn = Exception.class)
    public void CreateRestaurants(List<Restaurants> restaurantEntities) {
        if (restaurantEntities == null || restaurantEntities.isEmpty()) {
            log.warn("레스토랑 엔티티 리스트가 비어있습니다.");
            return;
        }
        try {
            // 저장 전 각 레스토랑 객체의 이미지 데이터 타입 확인
            for (Restaurants restaurant : restaurantEntities) {
                log.debug("저장 전 레스토랑 이미지 데이터 확인 - ID: {}, Name: {}, Address: {}", 
                         restaurant.getId(), restaurant.getRestaurant_name(), restaurant.getAddress());
                
                // 이미지 데이터 타입 확인
                byte[] imageBytes = restaurant.getImageBytes();
                if (imageBytes != null) {
                    log.info("이미지 데이터 타입 확인 - 길이: {}, 타입: {}, 클래스: {}", 
                            imageBytes.length, imageBytes.getClass().getName(), imageBytes.getClass());
                } else {
                    log.info("이미지 데이터 없음 (null)");
                }
                
                // 이미지 크기 타입 확인
                Long imageSize = restaurant.getImageSize();
                log.info("이미지 크기 확인 - 값: {}, 타입: {}", 
                        imageSize, imageSize != null ? imageSize.getClass().getName() : "null");
                
                // 이미지 데이터 필드 관련 모든 값을 로그로 출력
                log.info("=== saveAll 직전 최종 데이터 확인 ===");
                log.info("- restaurant.getImageBytes(): {} (타입: {})", 
                        imageBytes != null ? "byte[" + imageBytes.length + "]" : "null",
                        imageBytes != null ? imageBytes.getClass().getName() : "null");
                log.info("- restaurant.getImageSize(): {} (타입: {})", 
                        restaurant.getImageSize(),
                        restaurant.getImageSize() != null ? restaurant.getImageSize().getClass().getName() : "null");
                log.info("- restaurant.getImageName(): {}", restaurant.getImageName());
                log.info("- restaurant.getImageType(): {}", restaurant.getImageType());
                log.info("- restaurant.getImageUrl(): {}", restaurant.getImageUrl());
                
                // 필드 내부 실제 객체 검사
                log.info("=== 필드 내부 객체 타입 검사 ===");
                log.info("- imageBytes instanceof byte[]: {}", (imageBytes instanceof byte[]));
                log.info("- 클래스 로더 정보 - imageBytes: {}", 
                        imageBytes != null ? imageBytes.getClass().getClassLoader() : "null");
                
                // 값 재할당 테스트
                log.info("=== 값 재할당 테스트 ===");
                if (imageBytes != null) {
                    byte[] newCopy = new byte[imageBytes.length];
                    System.arraycopy(imageBytes, 0, newCopy, 0, imageBytes.length);
                    restaurant.setImageBytes(newCopy);
                    log.info("- 재할당 완료: 길이 {} 바이트", newCopy.length);
                }
            }
            
            log.info("saveAll 호출 직전...");
            
            // saveAll 대신 개별 저장으로 테스트
            log.info("개별 저장 시작 (saveAll 대신)...");
            List<Restaurants> savedRestaurants = new ArrayList<>();
            for (Restaurants restaurant : restaurantEntities) {
                log.info("레스토랑 개별 저장 - ID: {}, Name: {}", 
                    restaurant.getId(), restaurant.getRestaurant_name());
                
                // 이미지 데이터 필드 관련 모든 값을 다시 한번 로그로 출력
                byte[] imageBytes = restaurant.getImageBytes();
                log.info("- restaurant.getImageBytes(): {} (타입: {})", 
                    imageBytes != null ? "byte[" + imageBytes.length + "]" : "null",
                    imageBytes != null ? imageBytes.getClass().getName() : "null");
                
                // 클래스로더 정보 확인 (동일한 클래스로더에서 로드된 byte[] 타입인지 확인)
                if (imageBytes != null) {
                    log.info("- imageBytes ClassLoader: {}", imageBytes.getClass().getClassLoader());
                    log.info("- byte[].class ClassLoader: {}", byte[].class.getClassLoader());
                    
                    // 타입 강제 변환을 위한 새로운 byte[] 객체 생성
                    byte[] newBytes = new byte[imageBytes.length];
                    System.arraycopy(imageBytes, 0, newBytes, 0, imageBytes.length);
                    restaurant.setImageBytes(newBytes);
                    
                    log.info("- 새로운 byte[] 생성 후 길이: {}", newBytes.length);
                }
                
                // 개별 저장 시도
                try {
                    Restaurants savedRestaurant = restaurantsRepository.save(restaurant);
                    savedRestaurants.add(savedRestaurant);
                    log.info("레스토랑 저장 성공 - ID: {}", savedRestaurant.getId());
                } catch (Exception e) {
                    log.error("레스토랑 개별 저장 중 오류 발생: {}", e.getMessage(), e);
                    throw e;
                }
            }
            
            log.info("{} 개의 레스토랑이 DB에 저장/업데이트되었습니다.", savedRestaurants.size());
        } catch (Exception e) {
            log.error("레스토랑 저장 중 오류 발생: {}", e.getMessage(), e);
            throw e; // 트랜잭션 롤백을 위해 예외를 다시 던짐
        }
    }

    @Transactional(rollbackOn = Exception.class)
    public List<Restaurants> CreatePosts(List<Restaurants> restaurantEntities, Long userId) {
        if (restaurantEntities == null || restaurantEntities.isEmpty()) {
            log.warn("레스토랑 엔티티 리스트가 비어있습니다.");
            return List.of();
        }

        try {
            var user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));

            for (Restaurants restaurant : restaurantEntities) {
                String restaurantName = restaurant.getRestaurant_name();
                if (!postsRepository.findByUserIdAndRestaurantName(userId, restaurantName).isPresent()) {
                    Posts newPost = new Posts(user, restaurant);
                    newPost.setLatitude(restaurant.getLatitude());
                    newPost.setLongitude(restaurant.getLongitude());
                    newPost.setRestaurantName(restaurantName);
                    
                    postsRepository.save(newPost);
                    log.info("새로운 포스트가 저장되었습니다. user_id: {}, restaurant_name: {}", userId, restaurantName);
                } else {
                    log.info("이미 존재하는 포스트입니다. user_id: {}, restaurant_name: {}", userId, restaurantName);
                }
            }
            return restaurantEntities;
        } catch (Exception e) {
            log.error("포스트 저장 중 오류 발생: {}", e.getMessage(), e);
            throw e; // 트랜잭션 롤백을 위해 예외를 다시 던짐
        }
    }
}