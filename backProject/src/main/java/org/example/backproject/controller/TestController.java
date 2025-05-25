package org.example.backproject.controller;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backproject.entity.Restaurants;
import org.example.backproject.repository.RestaurantsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Map;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {
    private static final Logger log = LoggerFactory.getLogger(TestController.class);
    
    private final RestaurantsRepository restaurantsRepository;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @GetMapping("/save-image")
    @Transactional
    public ResponseEntity<?> testSaveImage() {
        try {
            // 테스트용 레스토랑 객체 생성
            Restaurants testRestaurant = new Restaurants();
            testRestaurant.setAddress("테스트 주소 " + System.currentTimeMillis()); // 고유한 주소
            testRestaurant.setRestaurant_name("테스트 식당");
            testRestaurant.setCategory("테스트 카테고리");
            testRestaurant.setRegion("테스트 지역");
            testRestaurant.setBody("테스트 내용입니다.");
            testRestaurant.setLatitude("37.123456");
            testRestaurant.setLongitude("127.123456");
            testRestaurant.setRate(4.5f);
            testRestaurant.setStatus(true);
            testRestaurant.setSource("테스트");
            
            // 테스트용 이미지 데이터
            byte[] dummyImageBytes = "이것은 테스트 이미지 바이트입니다.".getBytes(StandardCharsets.UTF_8);
            
            // 로그 확인
            log.info("====== 테스트 시작 ======");
            log.info("더미 이미지 바이트 생성 - 길이: {} 바이트, 타입: {}", 
                   dummyImageBytes.length, dummyImageBytes.getClass().getName());
            
            // 레스토랑 객체에 이미지 정보 설정
            testRestaurant.setImageBytes(dummyImageBytes);
            testRestaurant.setImageName("test.txt");
            testRestaurant.setImageType("text/plain");
            testRestaurant.setImageSize((long) dummyImageBytes.length);
            
            // 저장 직전 이미지 바이트 확인
            byte[] imageBytesToSave = testRestaurant.getImageBytes();
            log.info("테스트 저장 직전 이미지 확인: {} 바이트, 타입: {}", 
                  imageBytesToSave != null ? imageBytesToSave.length : "null", 
                  imageBytesToSave != null ? imageBytesToSave.getClass().getName() : "null");
            
            // 직접 네이티브 SQL로 저장 시도
            try {
                // 기본 필드들이 있는 엔티티 먼저 저장 (이미지 데이터 제외)
                testRestaurant.setImageBytes(null); // 이미지 데이터 일시적으로 제거
                Restaurants savedRestaurant = restaurantsRepository.save(testRestaurant);
                Long id = savedRestaurant.getId();
                log.info("기본 필드 저장 성공! ID: {}", id);
                
                // 네이티브 쿼리로 이미지 데이터 업데이트
                String sql = "UPDATE restaurant_info SET image_bytes = ?, image_name = ?, image_type = ?, image_size = ? WHERE id = ?";
                
                Connection connection = entityManager.unwrap(Connection.class);
                try (PreparedStatement ps = connection.prepareStatement(sql)) {
                    ps.setBytes(1, dummyImageBytes);
                    ps.setString(2, "test.txt");
                    ps.setString(3, "text/plain");
                    ps.setLong(4, dummyImageBytes.length);
                    ps.setLong(5, id);
                    
                    int updatedRows = ps.executeUpdate();
                    log.info("네이티브 쿼리로 이미지 업데이트 완료: {} 행 수정됨", updatedRows);
                }
                
                // 저장된 객체 다시 조회해서 확인
                entityManager.clear(); // 캐시 초기화
                Restaurants retrievedRestaurant = restaurantsRepository.findById(id).orElse(null);
                if (retrievedRestaurant != null && retrievedRestaurant.getImageBytes() != null) {
                    log.info("저장 후 조회 - 이미지 길이: {} 바이트", retrievedRestaurant.getImageBytes().length);
                } else {
                    log.warn("저장 후 조회 - 이미지 없음");
                }
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "id", id,
                    "message", "테스트 레스토랑 저장 성공 (네이티브 쿼리 사용)",
                    "imageSize", dummyImageBytes.length
                ));
            } catch (SQLException e) {
                log.error("네이티브 쿼리 실행 오류: ", e);
                throw new RuntimeException("네이티브 쿼리 실행 중 오류 발생", e);
            }
        } catch (Exception e) {
            log.error("테스트 저장 실패: ", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage(),
                "stackTrace", e.getStackTrace()[0].toString()
            ));
        }
    }

    @GetMapping("/save-image-em")
    @Transactional
    public ResponseEntity<?> testSaveImageEntityManager() {
        try {
            // 테스트용 레스토랑 객체 생성
            Restaurants testRestaurant = new Restaurants();
            testRestaurant.setAddress("EM 테스트 주소 " + System.currentTimeMillis()); // 고유한 주소
            testRestaurant.setRestaurant_name("EM 테스트 식당");
            testRestaurant.setCategory("EM 테스트 카테고리");
            testRestaurant.setRegion("EM 테스트 지역");
            testRestaurant.setBody("EM 테스트 내용입니다.");
            testRestaurant.setLatitude("37.123456");
            testRestaurant.setLongitude("127.123456");
            testRestaurant.setRate(4.5f);
            testRestaurant.setStatus(true);
            testRestaurant.setSource("EM 테스트");
            
            // 테스트용 이미지 데이터
            byte[] dummyImageBytes = "이것은 EntityManager 테스트 이미지 바이트입니다.".getBytes(StandardCharsets.UTF_8);
            
            // 로그 확인
            log.info("====== EntityManager 테스트 시작 ======");
            log.info("더미 이미지 바이트 생성 - 길이: {} 바이트, 타입: {}", 
                   dummyImageBytes.length, dummyImageBytes.getClass().getName());
            
            // 레스토랑 객체에 이미지 정보 설정
            testRestaurant.setImageBytes(dummyImageBytes);
            testRestaurant.setImageName("em-test.txt");
            testRestaurant.setImageType("text/plain");
            testRestaurant.setImageSize((long) dummyImageBytes.length);
            
            // EntityManager로 직접 저장 시도
            entityManager.persist(testRestaurant);
            entityManager.flush();
            
            Long id = testRestaurant.getId();
            log.info("EntityManager로 저장 성공! ID: {}", id);
            
            // 네이티브 쿼리로 직접 저장된 데이터 확인
            String checkSql = "SELECT encode(image_bytes, 'escape') FROM restaurant_info WHERE id = ?";
            Object result = entityManager.createNativeQuery(checkSql)
                            .setParameter(1, id)
                            .getSingleResult();
            
            log.info("저장된 바이트 데이터 확인: {}", result != null ? "데이터 있음" : "데이터 없음");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "id", id,
                "message", "EntityManager로 테스트 레스토랑 저장 성공",
                "imageSize", dummyImageBytes.length
            ));
        } catch (Exception e) {
            log.error("EntityManager 테스트 저장 실패: ", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage(),
                "stackTrace", e.getStackTrace()[0].toString()
            ));
        }
    }
    
    @GetMapping("/save-bytea-native")
    @Transactional
    public ResponseEntity<?> testSaveByteaNative() {
        try {
            String insertSql = 
                "INSERT INTO restaurant_info (address, restaurant_name, category, region, body, " +
                "latitude, longitude, rate, status, source, image_name, image_type, image_size, image_bytes) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";
            
            byte[] dummyImageBytes = "이것은 완전히 네이티브 쿼리 테스트 이미지 바이트입니다.".getBytes(StandardCharsets.UTF_8);
            
            log.info("====== 네이티브 쿼리 테스트 시작 ======");
            log.info("더미 이미지 바이트 생성 - 길이: {} 바이트", dummyImageBytes.length);
            
            // 완전 네이티브 쿼리로 직접 실행
            Object result = entityManager.createNativeQuery(insertSql)
                .setParameter(1, "네이티브 테스트 주소 " + System.currentTimeMillis())
                .setParameter(2, "네이티브 테스트 식당")
                .setParameter(3, "네이티브 테스트 카테고리")
                .setParameter(4, "네이티브 테스트 지역")
                .setParameter(5, "네이티브 테스트 내용입니다.")
                .setParameter(6, "37.123456")
                .setParameter(7, "127.123456")
                .setParameter(8, 4.5f)
                .setParameter(9, true)
                .setParameter(10, "네이티브 테스트")
                .setParameter(11, "native-test.txt")
                .setParameter(12, "text/plain")
                .setParameter(13, (long) dummyImageBytes.length)
                .setParameter(14, dummyImageBytes)
                .getSingleResult();
            
            Long id = ((Number) result).longValue();
            log.info("네이티브 쿼리로 저장 성공! ID: {}", id);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "id", id,
                "message", "네이티브 쿼리로 테스트 레스토랑 저장 성공",
                "imageSize", dummyImageBytes.length
            ));
        } catch (Exception e) {
            log.error("네이티브 쿼리 테스트 저장 실패: ", e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage(),
                "stackTrace", e.getStackTrace()[0].toString()
            ));
        }
    }
} 