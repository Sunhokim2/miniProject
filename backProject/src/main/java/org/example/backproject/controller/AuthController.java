package org.example.backproject.controller;

import org.example.backproject.dto.EmailDto;
import org.example.backproject.dto.SignupDto;
import org.example.backproject.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/email")
    public ResponseEntity<?> sendEmail(@RequestBody EmailDto dto) {
        try {
            authService.sendCode(dto.getEmail());
            return ResponseEntity.ok("인증 코드 발송됨");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("메일 전송 실패: " + e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupDto dto) {
        try {
            authService.signup(dto);
            return ResponseEntity.ok("회원가입 완료");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
