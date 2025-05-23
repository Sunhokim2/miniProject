package org.example.backproject.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backproject.service.UsersService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UsersService usersService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String token = extractToken(request);
            log.debug("JWT 필터 실행 - 경로: {}, 토큰: {}", request.getRequestURI(), token != null ? "존재함" : "없음");
            
            if (token != null && jwtUtil.validate(token)) {
                String email = jwtUtil.extractUsername(token);
                log.debug("토큰에서 추출한 이메일: {}", email);
                
                UserDetails userDetails = usersService.loadUserByUsername(email);
                log.debug("사용자 정보 로드: {}", userDetails.getUsername());
                
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("인증 설정 완료");
            } else if (token != null) {
                log.debug("토큰 검증 실패");
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("JWT 인증 오류: {}", e.getMessage());
            handleAuthenticationError(response, e);
        }
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        log.debug("Authorization 헤더: {}", bearerToken);
        
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private void handleAuthenticationError(HttpServletResponse response, Exception e) throws IOException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "인증에 실패했습니다.");
        error.put("message", e.getMessage());
        
        response.getWriter().write(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(error));
    }
} 