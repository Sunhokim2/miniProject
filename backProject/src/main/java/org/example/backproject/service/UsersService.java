package org.example.backproject.service;

import org.example.backproject.entity.Users;
import org.example.backproject.repository.UsersRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import org.springframework.security.core.userdetails.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsersService implements UserDetailsService {
    private final UsersRepository usersRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println(">> [DEBUG] 로그인 시도 이메일: " + email); // 직접 로그 추가

        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println(">> [ERROR] 사용자 없음: " + email);
                    return new UsernameNotFoundException("사용자 없음: " + email);
                });

        System.out.println(
                ">> [DEBUG] 찾은 사용자: " + user.getEmail() + ", PW: " + user.getPassword() + ", ROLE: " + user.getRole());

        // 엔티티에서 필요한 정보만 추출하여 UserDetails 객체 생성 (LOB 필드 접근 방지)
        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }

    @Transactional
    public void deleteByEmail(String email){
        usersRepository.deleteByEmail(email);
    }

    @Transactional
    public Users findByEmail(String email) {
        return usersRepository.findByEmail(email)
            .orElse(null);
    }

    @Transactional
    public Users updateUser(Users user) {
        return usersRepository.save(user);
    }
}
