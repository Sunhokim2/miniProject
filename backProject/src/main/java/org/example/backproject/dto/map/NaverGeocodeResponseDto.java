package org.example.backproject.dto.map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class NaverGeocodeResponseDto {
    private String status;
    private Meta meta;
    private List<Address> addresses;
    private String errorMessage;


    @Getter
    @Setter
    @NoArgsConstructor
    public static class Meta {
        private Integer totalCount;
        private Integer page;
        private Integer count;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Address {
        private String roadAddress;
        private String jibunAddress;
        private String x; // Longitude (경도)
        private String y; // Latitude (위도)
    }
}