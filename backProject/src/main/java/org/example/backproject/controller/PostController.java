package org.example.backproject.controller;

import lombok.RequiredArgsConstructor;

import org.example.backproject.dto.post.PlaceCardResponse;
import org.example.backproject.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
public ResponseEntity<Page<PlaceCardResponse>> getPosts(
        @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
        @RequestParam(required = false) Boolean visited
) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    Object principal = authentication.getPrincipal();

    String email;

    if (principal instanceof OAuth2User oAuth2User) {
        email = oAuth2User.getAttribute("email");
    } else if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
        email = userDetails.getUsername();
    } else {
        throw new RuntimeException("알 수 없는 사용자 인증 객체입니다.");
    }

    Long userId = postService.findUserIdByEmail(email);
    Page<PlaceCardResponse> result = postService.getPlaceCards(userId, pageable);
    return ResponseEntity.ok(result);
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/visit")
    public ResponseEntity<Void> toggleVisited(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((OAuth2User) authentication.getPrincipal()).getAttribute("email");
        Long userId = postService.findUserIdByEmail(email);
        postService.toggleVisited(userId, id);
        return ResponseEntity.noContent().build();
    }
}
