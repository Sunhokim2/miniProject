package org.example.backproject.dto.post;


import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backproject.entity.Posts;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PostListItemResponse {
    private Long postId;
    private Long restaurantId;
    private String restaurantName;
    private String latitude;
    private String longitude;
    private LocalDateTime createdAt;

    public static PostListItemResponse fromEntity(Posts post) {
        return new PostListItemResponse(
                post.getId(),
                post.getRestaurant().getId(),
                post.getRestaurantName(),
                post.getLatitude(),
                post.getLongitude(),
                post.getCreatedAt()
        );
    }
}
