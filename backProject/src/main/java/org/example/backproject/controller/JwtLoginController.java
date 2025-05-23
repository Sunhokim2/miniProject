package org.example.backproject.controller;

import java.util.Map;
import java.util.HashMap;

import org.springframework.security.core.AuthenticationException;

import org.example.backproject.security.JwtUtil;
import org.example.backproject.service.UsersService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.extern.slf4j.Slf4j;
import org.example.backproject.entity.Users;

@Slf4j
@RestController
@RequestMapping("/api/auth/")
@RequiredArgsConstructor
public class JwtLoginController {
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UsersService usersService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        log.info("Login request body: {}", body);
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(body.get("username"), body.get("password"))
            );
            String token = jwtUtil.createToken(authentication.getName());
            
            // 실제 Users 엔티티를 가져옵니다.
            String email = authentication.getName();
            Users userEntity = usersService.findByEmail(email);
            
            if (userEntity == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "사용자 정보를 찾을 수 없습니다."));
            }
            
            var user = usersService.loadUserByUsername(email);
            
            log.info("token: {}", token);
            log.info("authentication.getName(): {}", email);
            log.info("userEntity.getUserName(): {}", userEntity.getUserName());
            
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("id", userEntity.getId());  // 숫자 ID 사용
            result.put("email", email);
            result.put("userName", userEntity.getUserName());  // DB에서 가져온 실제 사용자 이름
            result.put("role", userEntity.getRole());
            result.put("emailVerified", userEntity.getEmailVerified());
            
            log.info("Final result map: {}", result);
            
            return ResponseEntity.ok(result);
        }
        catch (AuthenticationException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "로그인 실패: " + e.getMessage())); 
        }
    }
}
