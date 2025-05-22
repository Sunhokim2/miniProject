package org.example.backproject.controller;

import lombok.RequiredArgsConstructor;
import org.example.backproject.entity.Bookmark;
import org.example.backproject.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {
    private final BookmarkService bookmarkService;

    @GetMapping("/user")
    public ResponseEntity<?> getUserBookmarks(Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
                return ResponseEntity.status(401).body(Map.of("error", "인증되지 않은 사용자"));
            }

            User user = (User) authentication.getPrincipal();
            String email = user.getUsername();
            List<Bookmark> bookmarks = bookmarkService.getUserBookmarksByEmail(email);
            
            // 북마크 정보를 필요한 데이터만 포함하도록 변환
            List<Map<String, Object>> bookmarkDtos = bookmarks.stream()
                .map(bookmark -> Map.of(
                    "id", bookmark.getId(),
                    "restaurant", Map.of(
                        "id", bookmark.getRestaurant().getId(),
                        "name", bookmark.getRestaurant().getRestaurant_name(),
                        "category", bookmark.getRestaurant().getCategory(),
                        "region", bookmark.getRestaurant().getRegion(),
                        "rate", bookmark.getRestaurant().getRate(),
                        "address", bookmark.getRestaurant().getAddress(),
                        "imageUrl", bookmark.getRestaurant().getImageUrl()
                    ),
                    "createdAt", bookmark.getCreatedAt()
                ))
                .collect(Collectors.toList());

            return ResponseEntity.ok(bookmarkDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/toggle/{restaurantId}")
    public ResponseEntity<?> toggleBookmark(
            @PathVariable Long restaurantId,
            Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
                return ResponseEntity.status(401).body(Map.of("error", "인증되지 않은 사용자"));
            }

            User user = (User) authentication.getPrincipal();
            String email = user.getUsername();
            bookmarkService.toggleBookmarkByEmail(email, restaurantId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 