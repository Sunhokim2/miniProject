package org.example.backproject.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "posts")
public class Posts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @ManyToOne(fetch = LAZY, optional = false)
//    @JoinColumn(name = "user_id", nullable = false)
//    private Users user;

//    ❗❗❗❗개발용임시 user_id
    private Long userId;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "restaurant_id")
    private Restaurants restaurant;

    private String restaurantName;
    private String latitude;
    private String longitude;

    private boolean visited = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

//    ❗❗❗❗❗개발용으로 추가한 생성자입니다.
public Posts(Long userId, Restaurants restaurant) {
    this.userId = userId;
    this.restaurant = restaurant;
    this.createdAt = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS); // 초 단위 절삭 적용
}
}
