package org.example.backproject.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.example.backproject.dto.gpt.OpneAiRequest;
import org.example.backproject.dto.gpt.OpenAiResponse;

import java.util.List;
import java.util.Map;

@Service
public class GptApiService {
    @Value("${openai.api.url}")
    String API_URL;
    @Value("${openai.api.key}")
    String API_KEY;

    // 레스트 템플릿을 많이쓰는데 분위기가 webclient으로 바뀌고있음
    // 레스트 템플릿은 동기식으로 작동하고 webclient는 비동기식으로 작동함
    public String askQuestion(String question) {
        RestTemplate restTemplate = new RestTemplate();

        OpenAiRequest request = new OpenAiRequest();
        request.setModel("gpt-4o");
        request.setTemperature(0.7);
        request.setMax_tokens(300);
        request.setMessages(List.of(Map.of("role", "system", "content", "당신은 친절한 선생님입니다."),
                Map.of("role", "user", "content", question)));
        HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("Authorization", "Bearer " + API_KEY);
        headers.set("Content-Type", "application/json");
        HttpEntity<OpenAiRequest> entity = new org.springframework.http.HttpEntity<>(request, headers);

        // 만약 tts면 byte[]로 바꿔야함 (HttpEntity를)

        OpenAiResponse response = restTemplate
                .postForObject(API_URL, entity, OpenAiResponse.class);

        return response.getChoices().get(0).getMessage().getContent();
    }
}
