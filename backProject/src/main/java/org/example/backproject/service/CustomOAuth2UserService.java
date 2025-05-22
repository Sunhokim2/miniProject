package org.example.backproject.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.example.backproject.entity.Users;
import org.example.backproject.repository.UsersRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import io.github.cdimascio.dotenv.Dotenv;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Dotenv dotenv = Dotenv.load();

    // 기호 있을때 db조회시 오류나서 한글, 영문, 숫자, 공백만 남기고 나머지는 제거
    public static String cleanUserName(String userName) {
        if (userName == null)
            return null;
        return userName.replaceAll("[^가-힣a-zA-Z0-9 ]", "");
    }


    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        ClientRegistration googleRegistration = ClientRegistration.withRegistrationId("google")
                .clientId(dotenv.get("GOOGLE_CLIENT_ID"))
                .clientSecret(dotenv.get("GOOGLE_CLIENT_SECRET"))
                .scope("profile", "email")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://www.googleapis.com/oauth2/v4/token")
                .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
                .userNameAttributeName("email")
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .clientName("Google")
                .authorizationGrantType(
                        org.springframework.security.oauth2.core.AuthorizationGrantType.AUTHORIZATION_CODE)
                .build();

        ClientRegistration kakaoRegistration = ClientRegistration.withRegistrationId("kakao")
                .clientId(dotenv.get("KAKAO_CLIENT_ID"))
                // .clientSecret(dotenv.get("KAKAO_CLIENT_SECRET"))
                .scope("profile_nickname", "account_email")
                .authorizationUri("https://kauth.kakao.com/oauth/authorize")
                .tokenUri("https://kauth.kakao.com/oauth/token")
                .userInfoUri("https://kapi.kakao.com/v2/user/me")
                .userNameAttributeName("id") // 카카오는 id로 유저 식별
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .clientName("Kakao")
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .build();

        return new InMemoryClientRegistrationRepository(googleRegistration);
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // "google" or "kakao"
        String email = null;
        String name = null;

        Map<String, Object> attributes = oAuth2User.getAttributes();

        if ("google".equals(registrationId)) {
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
        } else if ("kakao".equals(registrationId)) {
            // 카카오 구조: {id, properties: {nickname}, kakao_account: {email}, ...}
            System.out.println("카카오 attributes: " + attributes);
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
            email = kakaoAccount != null ? (String) kakaoAccount.get("email") : null;
            name = properties != null ? (String) properties.get("nickname") : null;
            System.out.println("카카오 email: " + email + ", name: " + name);
        } else {
            throw new OAuth2AuthenticationException("Unknown provider: " + registrationId);
        }

        if (email == null) {
            throw new OAuth2AuthenticationException("카카오에서 email 정보를 받아오지 못했습니다.");
        }

        String cleanName = cleanUserName(name);

        Users user = usersRepository.findByEmail(email).orElse(null);

        if (user == null) {
            Users newUser = new Users();
            newUser.setEmail(email);
            newUser.setUserName(cleanName);
            newUser.setPassword(passwordEncoder.encode("SOCIAL_LOGIN_USER"));
            newUser.setRole("USER");
            newUser.setEmailVerified(true);
            newUser.setCreatedAt(LocalDateTime.now());
            user = usersRepository.save(newUser);
        }

        Map<String, Object> userAttributes = new HashMap<>(attributes);
        userAttributes.put("email", email); // 구글이랑 카카오 attribute 형태가 달라서 email을 최상위로 넣어서 토큰값 받아올 수 있도록

        return new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority(user.getRole())),
                userAttributes,
                "email");
    }
}
