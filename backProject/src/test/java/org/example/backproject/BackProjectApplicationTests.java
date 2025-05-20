package org.example.backproject;

import org.example.backproject.service.NaverGeoCodingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

@SpringBootTest
class BackProjectApplicationTests {
    @Autowired
    NaverGeoCodingService naverGeoCodingService;
    @Test
    void contextLoads() throws UnsupportedEncodingException {
        String validAddress = "인천광역시남동구"; // 네이버 본사 주소 (예시)
        List<String> result = naverGeoCodingService.getCoordinates(validAddress);

        System.out.println("경도(X): " + result);
//        System.out.println("위도(Y): " + latitude);
    }

}
