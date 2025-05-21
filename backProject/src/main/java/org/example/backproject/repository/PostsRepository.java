package org.example.backproject.repository;

import org.example.backproject.entity.Posts;
import org.example.backproject.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostsRepository extends JpaRepository<Posts, Long> {
    Page<Posts> findAllByUserId(Long userId, Pageable pageable);

    Page<Posts> findAllByUserIdAndVisitedTrue(Long userId, Pageable pageable);

    Page<Posts> findAllByUserIdAndVisitedFalse(Long userId, Pageable pageable);

    Optional<Posts> findByUserIdAndRestaurantName(Long userId, String restaurantName);
}
