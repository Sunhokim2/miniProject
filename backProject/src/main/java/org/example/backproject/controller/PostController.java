package org.example.backproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.backproject.dto.post.PostListItemResponse;
import org.example.backproject.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<Page<PostListItemResponse>> getPosts(
            //TODO: 사용자 인증
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) Boolean visited
    ) {
        //userDetails.getUser().getId()
        Long userId = 1L;
        Page<PostListItemResponse> result = postService.getPosts(userId, pageable, visited);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/visit")
    public ResponseEntity<Void> toggleVisited(@PathVariable Long id) {
        //TODO: 사용자 인증
        Long userId = 1L;
        postService.toggleVisited(userId, id);
        return ResponseEntity.noContent().build();
    }
}
