package org.example.backproject.controller;

import org.example.backproject.dto.EmailDto;
import org.example.backproject.dto.SignupDto;
import org.example.backproject.service.AuthService;
import org.example.backproject.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.User;
import org.example.backproject.entity.Users;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UsersService usersService;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "인증되지 않은 사용자");
            return ResponseEntity.status(401).body(error);
        }

        Object principal = authentication.getPrincipal();
        String email;
        if (principal instanceof OAuth2User) {
            email = ((OAuth2User) principal).getAttribute("email");
        } else if (principal instanceof User) {
            email = ((User) principal).getUsername();
        } else if (principal instanceof String) {
            email = (String) principal;
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "알 수 없는 인증 타입");
            return ResponseEntity.status(500).body(error);
        }

        Users user = usersService.findByEmail(email);
        if (user == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "사용자를 찾을 수 없습니다");
            return ResponseEntity.status(404).body(error);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("userName", user.getUserName());
        response.put("emailVerified", user.getEmailVerified());
        response.put("role", user.getRole());
        response.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/email")
    public ResponseEntity<?> sendEmail(@RequestBody EmailDto dto) {
        log.info("이메일 인증 코드 요청: {}", dto.getEmail());
        log.debug("요청 본문: {}", dto);
        
        try {
            log.debug("AuthService.sendCode 호출 전");
            authService.sendCode(dto.getEmail());
            log.debug("AuthService.sendCode 호출 후");
            
            log.info("이메일 인증 코드 발송 성공: {}", dto.getEmail());
            Map<String, String> response = new HashMap<>();
            response.put("message", "인증 코드 발송됨");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("이메일 인증 코드 발송 실패 (런타임 예외): {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        } catch (Exception e) {
            log.error("이메일 인증 코드 발송 실패: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "메일 전송 실패: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
        @RequestBody SignupDto dto) {
       System.out.println(dto);
        try {
             authService.signup(dto);

            return ResponseEntity.ok("{\"message\": \"회원가입 완료\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        String email;
        if (principal instanceof OAuth2User) {
            email = ((OAuth2User) principal).getAttribute("email");
        } else if (principal instanceof User) {
            email = ((User) principal).getUsername();
        } else if (principal instanceof String) {
            email = (String) principal;
        } else {
            throw new IllegalStateException("알 수 없는 인증 타입: " + principal.getClass());
        }
        usersService.deleteByEmail(email);
        return ResponseEntity.ok("{\"message\": \"회원 탈퇴가 완료되었습니다.\"}");
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(
        @RequestBody Map<String, String> updateData,
        Authentication authentication
    ) {
        if (authentication == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "인증되지 않은 사용자");
            return ResponseEntity.status(401).body(error);
        }

        Object principal = authentication.getPrincipal();
        String email;
        if (principal instanceof OAuth2User) {
            email = ((OAuth2User) principal).getAttribute("email");
        } else if (principal instanceof User) {
            email = ((User) principal).getUsername();
        } else if (principal instanceof String) {
            email = (String) principal;
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "알 수 없는 인증 타입");
            return ResponseEntity.status(500).body(error);
        }

        try {
            Users user = usersService.findByEmail(email);
            if (user == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "사용자를 찾을 수 없습니다");
                return ResponseEntity.status(404).body(error);
            }

            // 업데이트할 필드가 있는 경우에만 업데이트
            if (updateData.containsKey("userName")) {
                user.setUserName(updateData.get("userName"));
            }

            usersService.updateUser(user);

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("userName", user.getUserName());
            response.put("emailVerified", user.getEmailVerified());
            response.put("role", user.getRole());
            response.put("createdAt", user.getCreatedAt());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "사용자 정보 업데이트 실패: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
