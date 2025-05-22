package org.example.backproject.controller;

import org.example.backproject.dto.EmailDto;
import org.example.backproject.dto.SignupDto;
import org.example.backproject.service.AuthService;
import org.example.backproject.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UsersService usersService;

    @PostMapping("/email")
    public ResponseEntity<?> sendEmail(@RequestBody EmailDto dto) {
        try {
            authService.sendCode(dto.getEmail());
            return ResponseEntity.ok("{\"message\": \"인증 코드 발송됨\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"메일 전송 실패: " + e.getMessage() + "\"}");
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
}
