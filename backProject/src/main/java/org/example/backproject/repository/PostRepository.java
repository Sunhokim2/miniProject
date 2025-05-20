package org.example.backproject.repository;

import org.example.backproject.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findAllByUserId(Long userId, Pageable pageable);

    Page<Post> findAllByUserIdAndVisitedTrue(Long userId, Pageable pageable);

    Page<Post> findAllByUserIdAndVisitedFalse(Long userId, Pageable pageable);
}
