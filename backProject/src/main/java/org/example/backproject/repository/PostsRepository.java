package org.example.backproject.repository;

import org.example.backproject.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostsRepository extends JpaRepository<Posts, Long> {
    Optional<Posts> findByUserIdAndRestaurantName(Long userId, String restaurantName);
}
