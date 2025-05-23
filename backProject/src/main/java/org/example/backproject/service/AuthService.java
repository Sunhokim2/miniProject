package org.example.backproject.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.example.backproject.dto.SignupDto;
import org.example.backproject.entity.Users;
import org.example.backproject.repository.UsersRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsersRepository usersRepository;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, String> emailCodeMap = new HashMap<>();

    public void sendCode(String email) throws Exception {
        log.info("인증 코드 발송 시작: {}", email);
        try {
            // 이미 존재하는 이메일인지 확인
            if (usersRepository.existsByEmail(email)) {
                log.warn("이미 등록된 이메일로 인증 시도: {}", email);
                throw new RuntimeException("이미 등록된 이메일입니다.");
            }
            
            String code = mailService.sendVerificationCode(email);
            log.info("인증 코드 생성 및 메일 발송 성공: {}", email);
            emailCodeMap.put(email, code);
            log.debug("이메일 코드 맵에 저장됨: {} -> {}", email, code);
        } catch (Exception e) {
            log.error("인증 코드 발송 실패: {}, 원인: {}", email, e.getMessage());
            throw e;
        }
    }

    public void signup(SignupDto dto) {
        log.info("회원가입 시도: {}", dto.getEmail());
        String code = emailCodeMap.get(dto.getEmail());
        
        if (code == null) {
            log.warn("인증 코드가 존재하지 않음: {}", dto.getEmail());
            throw new RuntimeException("이메일 인증이 필요합니다.");
        }
        
        if (!code.equals(dto.getCode())) {
            log.warn("인증 코드 불일치: {} (입력: {}, 저장: {})", dto.getEmail(), dto.getCode(), code);
            throw new RuntimeException("이메일 인증 코드가 일치하지 않습니다.");
        }
        
        if (usersRepository.existsByEmail(dto.getEmail())) {
            log.warn("중복 이메일로 회원가입 시도: {}", dto.getEmail());
            throw new RuntimeException("이미 등록된 이메일입니다.");
        }

        Users user = new Users();
        user.setEmail(dto.getEmail());
        user.setUserName(dto.getUserName());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmailVerified(true);
        user.setCreatedAt(LocalDateTime.now());

        usersRepository.save(user);
        log.info("회원가입 완료: {}", dto.getEmail());
        emailCodeMap.remove(dto.getEmail());
        log.debug("이메일 코드 맵에서 제거됨: {}", dto.getEmail());
    }
}
