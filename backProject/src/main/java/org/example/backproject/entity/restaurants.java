package org.example.backproject.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Table(name = "restaurant_info") // 테이블명은 원하는 대로 변경 가능합니다.
public class Restaurants {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 음식점명
    private String restaurant_name;

    // 주소 <<- 이걸로 판단해서 중복방지
    @Column(unique = true, nullable = false)
    private String address;

    // 종류(빵집, 카페, 식당 등)
    private String category;
    // 지역명
    private String region;
    // 메인메뉴 3가지
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> mainMenu;

    // gpt 블로그 요약본
    @Lob // 긴 텍스트를 위한 어노테이션
    @Basic(fetch = FetchType.EAGER)
    @Column(columnDefinition = "TEXT") // DB에 따라 TEXT 타입 지정
    private String body;

    private String latitude; // 위도 (maps에서 String반환임)
    private String longitude; // 경도

    // 별점은 실수형
    private Float rate;

    private Boolean status;
    private String source;

    // 이미지 URL 추가
    private String imageUrl;
    
    // 이미지 데이터 직접 저장 (신규 필드)
    @Lob
    @Column(name = "image_bytes", nullable = true)
    @Basic(fetch = FetchType.LAZY)
    @JdbcTypeCode(SqlTypes.BINARY)
    private byte[] imageBytes = null;
    
    // 이미지 메타데이터 (신규 필드)
    @Column(name = "image_name")
    private String imageName;
    
    @Column(name = "image_type")
    private String imageType;
    
    @Column(name = "image_size")
    private Long imageSize;
    
    // 기본 생성자 추가
    public Restaurants() {
    }
    
    // getter와 setter 메서드들
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getRestaurant_name() {
        return restaurant_name;
    }
    
    public void setRestaurant_name(String restaurant_name) {
        this.restaurant_name = restaurant_name;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getRegion() {
        return region;
    }
    
    public void setRegion(String region) {
        this.region = region;
    }
    
    public List<String> getMainMenu() {
        return mainMenu;
    }
    
    public void setMainMenu(List<String> mainMenu) {
        this.mainMenu = mainMenu;
    }
    
    public String getBody() {
        return body;
    }
    
    public void setBody(String body) {
        this.body = body;
    }
    
    public String getLatitude() {
        return latitude;
    }
    
    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }
    
    public String getLongitude() {
        return longitude;
    }
    
    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }
    
    public Float getRate() {
        return rate;
    }
    
    public void setRate(Float rate) {
        this.rate = rate;
    }
    
    public Boolean getStatus() {
        return status;
    }
    
    public void setStatus(Boolean status) {
        this.status = status;
    }
    
    public String getSource() {
        return source;
    }
    
    public void setSource(String source) {
        this.source = source;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getImageName() {
        return imageName;
    }
    
    public void setImageName(String imageName) {
        this.imageName = imageName;
    }
    
    public String getImageType() {
        return imageType;
    }
    
    public void setImageType(String imageType) {
        this.imageType = imageType;
    }
    
    public Long getImageSize() {
        return imageSize;
    }
    
    public void setImageSize(Long imageSize) {
        this.imageSize = imageSize;
    }
    
    // 이미지 바이트 접근자 메서드 - 중요한 부분
    public byte[] getImageBytes() {
        return this.imageBytes;
    }
    
    public void setImageBytes(byte[] imageBytes) {
        // 방어적 검사 추가
        if (imageBytes == null) {
            this.imageBytes = null;
            return;
        }
        
        // 방어적 복사
        this.imageBytes = imageBytes.clone();
    }
    
    // 이전 메서드와의 호환성을 위한 메서드
    @Deprecated
    public byte[] getImageData() {
        return getImageBytes();
    }
    
    @Deprecated
    public void setImageData(byte[] imageData) {
        setImageBytes(imageData);
    }
}
