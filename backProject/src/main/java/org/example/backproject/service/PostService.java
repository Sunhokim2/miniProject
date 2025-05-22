package org.example.backproject.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.backproject.dto.post.PostListItemResponse;
import org.example.backproject.entity.Posts;
import org.example.backproject.repository.PostsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostsRepository postRepository;

    public Page<PostListItemResponse> getPosts(Long userId, Pageable pageable, Boolean visited) {
        Page<Posts> postPage;

        if (visited == null) {
            postPage = postRepository.findAllByUserId(userId, pageable);
        } else if (visited) {
            postPage = postRepository.findAllByUserIdAndVisitedTrue(userId, pageable);
        } else {
            postPage = postRepository.findAllByUserIdAndVisitedFalse(userId, pageable);
        }

        return postPage.map(PostListItemResponse::fromEntity);
    }

    @Transactional
    public void deleteById(Long id) {
        if (!postRepository.existsById(id)) {
            throw new EntityNotFoundException("post not found with id: " + id);
        }
        postRepository.deleteById(id);
    }

    @Transactional
    public void toggleVisited(Long userId, Long postId) {
        Posts post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("post not found with id: " + postId));

        if (post.getUser().getId().equals(userId)) {
            post.toggleVisited(); // 내가 작성한 post일 때만 토글
        }
    }
}
