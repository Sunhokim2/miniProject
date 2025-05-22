package org.example.backproject.repository;

import org.example.backproject.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserId(Long userId);
    void deleteByUserIdAndRestaurantId(Long userId, Long restaurantId);
    boolean existsByUserIdAndRestaurantId(Long userId, Long restaurantId);
} 