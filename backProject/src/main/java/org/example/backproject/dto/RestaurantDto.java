package org.example.backproject.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backproject.entity.Restaurants;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class RestaurantDto {
    private Long id;
    private String restaurantName;
    private String address;
    private String category;
    private String region;
    private List<String> mainMenu = new ArrayList<>();
    private String body;
    private String latitude;
    private String longitude;
    private Float rate;
    private Boolean status;
    private String source;
    private String imageUrl;

    public RestaurantDto(Restaurants entity) {
        this.id = entity.getId();
        this.restaurantName = entity.getRestaurant_name();
        this.address = entity.getAddress();
        this.category = entity.getCategory();
        this.region = entity.getRegion();
        if (entity.getMainMenu() != null) {
            this.mainMenu.addAll(entity.getMainMenu());
        }
        this.body = entity.getBody();
        this.latitude = entity.getLatitude();
        this.longitude = entity.getLongitude();
        this.rate = entity.getRate();
        this.status = entity.getStatus();
        this.source = entity.getSource();
        this.imageUrl = entity.getImageUrl();
    }
} 