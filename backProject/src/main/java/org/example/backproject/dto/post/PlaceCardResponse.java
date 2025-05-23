package org.example.backproject.dto.post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceCardResponse {
    private Long postId;
    private Long restaurantId;
    private String restaurantName;
    private String imageUrl;
    private String category;
    private List<String> mainMenu;
    private String description;
    private String address;
    private String region;
    private Float rate;
    private String source;
    private String status;
    private String createdAt;
    private double latitude;
    private double longitude;
    private boolean visited;
    private boolean bookmarked;
}