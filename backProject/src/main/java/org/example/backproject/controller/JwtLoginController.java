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
            var user = usersService.loadUserByUsername(authentication.getName());
            System.out.println("user: " + user);
            log.info("token: {}", token);
            log.info("authentication.getName(): {}", authentication.getName());
            log.info("body.get(\"username\"): {}", body.get("username"));
            log.info("user.getUsername(): {}", user.getUsername());
            
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("id", authentication.getName() != null ? authentication.getName() : "");
            result.put("email", body.get("username") != null ? body.get("username") : "");
            result.put("userName", user.getUsername() != null ? user.getUsername() : "");
            
            log.info("Final result map: {}", result);
            
            return ResponseEntity.ok(result);
        }
        catch (AuthenticationException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "로그인 실패: " + e.getMessage())); 
        }
    }
}
