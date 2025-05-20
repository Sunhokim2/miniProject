package org.example.backproject.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "restaurant_info") // 테이블명은 원하는 대로 변경 가능합니다.
public class Restaurants {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 음식점명
    private String restaurant_name;
    // 주소
    private String address;
    // 종류(빵집, 카페, 식당 등)
    private String category;
    // 지역명
    private String region;
    // 메인메뉴 3가지
    @ElementCollection
    private List<String> mainMenu;

    // gpt 블로그 요약본
    @Lob // 긴 텍스트를 위한 어노테이션
    @Column(columnDefinition = "TEXT") // DB에 따라 TEXT 타입 지정
    private String body;

    private String latitude; // 위도 (maps에서 String반환임)
    private String longitude; // 경도

    // 별점은 실수형
    private Float rate;

    private Boolean status;
    private String source;
}
