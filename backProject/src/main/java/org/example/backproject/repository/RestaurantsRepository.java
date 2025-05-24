package org.example.backproject.repository;

import org.example.backproject.entity.Restaurants;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantsRepository extends JpaRepository<Restaurants, Long> {
    boolean existsByAddress(String address);
    
    @EntityGraph(attributePaths = {"mainMenu"})
    Optional<Restaurants> findByAddress(String address);

    @Query(value = "SELECT * FROM restaurant_info WHERE " +
           "6371 * acos(cos(radians(CAST(:latitude AS DOUBLE PRECISION))) * " +
           "cos(radians(CAST(latitude AS DOUBLE PRECISION))) * " +
           "cos(radians(CAST(longitude AS DOUBLE PRECISION)) - radians(CAST(:longitude AS DOUBLE PRECISION))) + " +
           "sin(radians(CAST(:latitude AS DOUBLE PRECISION))) * " +
           "sin(radians(CAST(latitude AS DOUBLE PRECISION)))) <= :distance", 
           nativeQuery = true)
    List<Restaurants> findNearbyRestaurants(
        @Param("latitude") String latitude,
        @Param("longitude") String longitude,
        @Param("distance") double distance
    );
    
    // 추가: JPQL 쿼리로 변경하여 EntityGraph 적용 가능하게 함
    @EntityGraph(attributePaths = {"mainMenu"})
    @Query("SELECT r FROM Restaurants r WHERE " +
           "6371 * acos(cos(radians(CAST(:latitude AS double))) * " +
           "cos(radians(CAST(r.latitude AS double))) * " +
           "cos(radians(CAST(r.longitude AS double)) - radians(CAST(:longitude AS double))) + " +
           "sin(radians(CAST(:latitude AS double))) * " +
           "sin(radians(CAST(r.latitude AS double)))) <= :distance")
    List<Restaurants> findNearbyRestaurantsWithGraph(
        @Param("latitude") String latitude,
        @Param("longitude") String longitude,
        @Param("distance") double distance
    );
}
