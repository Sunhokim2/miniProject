package org.example.backproject.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.example.backproject.security.JwtUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String jwt = jwtUtil.createToken(email);

        String encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8.toString());
        String encodedName = URLEncoder.encode(name, StandardCharsets.UTF_8.toString());
        // 프론트엔드로 리다이렉트 (provider 정보 포함)
        String redirectUrl = String.format("http://localhost:5173/oauth/callback/google?token=%s&email=%s&name=%s", 
            jwt, encodedEmail, encodedName);
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
