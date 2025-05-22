package org.example.backproject.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class GptSummaryDto {
    private String restaurant_name;
    private String category;
    private String region;
    // JSON의 "main_menu" 키를 이 필드에 매핑
    @JsonProperty("main_menu")
    private List<String> mainMenu;
    private String address;
    private String body;
    private Float rate;

    // "status" 필드는 Restaurants 엔티티에 없으므로, 파싱은 되지만 사용하지 않음
    private Boolean status;

//    따로할것
    private String latitude;
    private String longitude;
    private String source;
    private String image;

}