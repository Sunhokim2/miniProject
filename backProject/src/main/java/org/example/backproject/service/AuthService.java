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

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsersRepository usersRepository;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, String> emailCodeMap = new HashMap<>();

    public void sendCode(String email) throws Exception {
        String code = mailService.sendVerificationCode(email);
        emailCodeMap.put(email, code);
    }

    public void signup(SignupDto dto) {
        String code = emailCodeMap.get(dto.getEmail());
        if (code == null || !code.equals(dto.getCode())) {
            throw new RuntimeException("{\"message\": \"이메일 인증 코드가 일치하지 않습니다.\"}");
        }
        if (usersRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("{\"message\": \"이미 등록된 이메일입니다.\"}");
        }

        Users user = new Users();
        user.setEmail(dto.getEmail());
        user.setUserName(dto.getUserName());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmailVerified(true);
        user.setCreatedAt(LocalDateTime.now());

        usersRepository.save(user);
        emailCodeMap.remove(dto.getEmail());
    }
}
