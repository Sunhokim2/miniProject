package org.example.backproject.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backproject.entity.Restaurants;

import java.util.ArrayList;
import java.util.Base64;
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
    
    // 이미지 메타데이터
    private String imageName;
    private String imageType;
    private Long imageSize;
    
    // 프론트엔드로 전송할 Base64 인코딩된 이미지 데이터
    private String imageBase64;

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
        
        // 이미지 메타데이터 설정
        this.imageName = entity.getImageName();
        this.imageType = entity.getImageType();
        this.imageSize = entity.getImageSize();
        
        // 이미지 데이터가 있는 경우 Base64로 인코딩
        if (entity.getImageData() != null && entity.getImageData().length > 0) {
            this.imageBase64 = "data:" + entity.getImageType() + ";base64," + 
                              Base64.getEncoder().encodeToString(entity.getImageData());
        }
    }
} 