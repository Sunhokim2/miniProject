package org.example.backproject.repository;

import org.example.backproject.entity.Restaurants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantsRepository extends JpaRepository<Restaurants, Long> {
    boolean existsByAddress(String address);
    Optional<Restaurants> findByAddress(String address);
}
