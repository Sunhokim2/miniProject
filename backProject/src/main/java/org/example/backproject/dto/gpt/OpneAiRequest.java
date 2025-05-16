package org.example.backproject.dto.gpt;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class OpneAiRequest {
    private String model;
    private List<Map<String, String>> messages;
    private double temperature;
    private int max_tokens;
}
