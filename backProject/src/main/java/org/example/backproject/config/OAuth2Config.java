package org.example.backproject.config;

import io.github.cdimascio.dotenv.Dotenv;

public class OAuth2Config {
    private static final Dotenv dotenv = Dotenv.load();
    public static final String GOOGLE_CLIENT_ID = dotenv.get("GOOGLE_CLIENT_ID");
    public static final String GOOGLE_CLIENT_SECRET = dotenv.get("GOOGLE_CLIENT_SECRET");
    public static final String KAKAO_CLIENT_ID = dotenv.get("KAKAO_CLIENT_ID");
    public static final String KAKAO_CLIENT_SECRET = dotenv.get("KAKAO_CLIENT_SECRET");
}
