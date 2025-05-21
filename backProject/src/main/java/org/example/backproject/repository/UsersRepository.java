package org.example.backproject.repository;

import java.util.Optional;

import org.example.backproject.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UsersRepository extends JpaRepository<Users, Long>{
    // 이메일로 유저 찾기
    Optional<Users> findByEmail(String email);

    // 이메일 중복 체크
    boolean existsByEmail(String email);


}
