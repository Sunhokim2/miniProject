package org.example.backproject;

import org.example.backproject.entity.Posts;
import org.example.backproject.repository.PostsRepository;
import org.example.backproject.service.NaverGeoCodingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@SpringBootTest
class BackProjectApplicationTests {
    @Autowired
    NaverGeoCodingService naverGeoCodingService;
    @Autowired
    PostsRepository postsRepository;

    @Test
    void contextLoads() throws UnsupportedEncodingException {
        String validAddress = "인천광역시남동구"; // 네이버 본사 주소 (예시)
        List<String> result = naverGeoCodingService.getCoordinates(validAddress);

        System.out.println("경도(X): " + result);
//        System.out.println("위도(Y): " + latitude);
    }

    @Test
    void sss(){
        Optional<Posts> postOpt = postsRepository.findByUserIdAndRestaurantName(1L, "성심당 케익부띠끄");

            Posts post = postOpt.get();
            System.out.println("찾은 Post ID: " + post.getId() + ", 방문 여부: " + post.isVisited());

    }

}
