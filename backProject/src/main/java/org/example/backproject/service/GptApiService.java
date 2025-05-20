package org.example.backproject.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.example.backproject.dto.gpt.OpenAiRequest;
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
    public String summarizeBlog(String content) {
        String contents = """
            응답은 placeData형식으로 요약합니다.
            {
                "restaurant_name": "[음식점 이름]",
                "category" : "[음식점 종류]",
                "region": "[지역명]",
                "main_menu": "[메인메뉴 최대3가지를 리스트로]", 
                "address" : "[상세주소]", 
                "body" : "[블로그에 작성된 내용을 이모티콘과함께 간략하게 요약]",
                "rate": "[별점]", 
                "status": "[방문여부(기본은 방문함)]"
            } 
            restaurant_name에는 음식점이름만 나오고 지역점포인건 표시하지않습니다.
            category의 음식점 종류는 [한식, 양식, 일식, 중식, 카페]
            address는 전체주소가 나와야만 합니다.
            region은 [
                              "서울시 강남구", "서울시 강동구", "서울시 강북구", "서울시 강서구", "서울시 관악구",
                              "서울시 광진구", "서울시 구로구", "서울시 금천구", "서울시 노원구", "서울시 도봉구",
                              "서울시 동대문구", "서울시 동작구", "서울시 마포구", "서울시 서대문구", "서울시 서초구",
                              "서울시 성동구", "서울시 성북구", "서울시 송파구", "서울시 양천구", "서울시 영등포구",
                              "서울시 용산구", "서울시 은평구", "서울시 종로구", "서울시 중구", "서울시 중랑구",
                
                              "인천시 계양구", "인천시 남동구", "인천시 미추홀구", "인천시 부평구", "인천시 서구",
                              "인천시 연수구", "인천시 중구", "인천시 동구", "인천시 강화군", "인천시 옹진군",
                
                              "부산시 강서구", "부산시 금정구", "부산시 기장군", "부산시 남구", "부산시 동구",
                              "부산시 동래구", "부산시 부산진구", "부산시 북구", "부산시 사상구", "부산시 사하구",
                              "부산시 서구", "부산시 수영구", "부산시 연제구", "부산시 영도구", "부산시 중구",
                              "부산시 해운대구",
                
                              "대구시 남구", "대구시 달서구", "대구시 달성군", "대구시 동구", "대구시 북구",
                              "대구시 서구", "대구시 수성구", "대구시 중구",
                
                              "광주시 광산구", "광주시 남구", "광주시 동구", "광주시 북구", "광주시 서구",
                
                              "대전시 대덕구", "대전시 동구", "대전시 서구", "대전시 유성구", "대전시 중구",
                
                              "울산시 남구", "울산시 동구", "울산시 북구", "울산시 중구", "울산시 울주군",
                
                              "수원시", "고양시", "용인시", "성남시", "부천시",
                              "화성시", "안산시", "남양주시", "안양시", "평택시",
                              "시흥시", "파주시", "의정부시", "김포시", "광주시",
                              "광명시", "군포시", "하남시", "오산시", "양주시",
                              "이천시", "구리시", "안성시", "포천시", "의왕시",
                              "여주시", "동두천시", "과천시", "가평군", "양평군",
                              "연천군", "춘천시", "원주시", "강릉시", "동해시",
                              "태백시", "속초시", "삼척시", "홍천군", "횡성군",
                              "영월군", "평창군", "정선군", "철원군", "화천군",
                              "양구군", "인제군", "고성군", "양양군", "청주시",
                              "충주시", "제천시", "보은군", "옥천군", "영동군",
                              "증평군", "진천군", "괴산군", "음성군", "단양군",
                              "천안시", "공주시", "보령시", "아산시", "서산시",
                              "논산시", "계룡시", "당진시", "금산군", "부여군",
                              "서천군", "청양군", "홍성군", "예산군", "태안군",
                              "포항시", "경주시", "김천시", "안동시", "구미시",
                              "영주시", "영천시", "상주시", "문경시", "경산시",
                              "의성군", "청송군", "영양군", "영덕군", "청도군",
                              "고령군", "성주군", "칠곡군", "예천군", "봉화군",
                              "울진군", "울릉군", "창원시", "진주시", "통영시",
                              "사천시", "김해시", "밀양시", "거제시", "양산시",
                              "의령군", "함안군", "창녕군", "남해군", "하동군",
                              "산청군", "함양군", "거창군", "합천군", "전주시",
                              "군산시", "익산시", "정읍시", "남원시", "김제시",
                              "완주군", "진안군", "무주군", "장수군", "임실군",
                              "순창군", "고창군", "부안군", "목포시", "여수시",
                              "순천시", "나주시", "광양시", "담양군", "곡성군",
                              "구례군", "고흥군", "보성군", "화순군", "장흥군",
                              "강진군", "해남군", "영암군", "무안군", "함평군",
                              "영광군", "장성군", "완도군", "진도군", "신안군",
                              "제주시", "서귀포시"
                            ] 이 중에 선택하세요.
            rate는 float형식입니다.
            status는 bool형식입니다.
            
            다음은 블로그 전문입니다.
        """ + content;
//        sorce는 이거 검색에 쓰인걸 그대로 넣을거임
//        위도 경도는 address기반으로 지도api에서 검색해야할듯
//        블로그 image도 이걸로는 못찾음

        RestTemplate restTemplate = new RestTemplate();

        OpenAiRequest request = new OpenAiRequest();
        request.setModel("gpt-4o-mini");
        request.setTemperature(0.7);
        request.setMax_tokens(300);
        request.setMessages(List.of(
                Map.of("role", "system", "content",
                        "당신은 블로그 요약전문가입니다. 블로그 내용 전문을 보고 핵심을 정리해서 이모티콘과함께 사용자한테 요약합니다. 이벤트의 내용은 다루지 마시고, 음식의 대한 설명과 매장의 상태, 친절도 위주로 요약하세요. 대답은 항상 json형태의 String으로만 대답합니다."),
                Map.of("role", "user", "content", contents)
        ));
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + API_KEY);
        headers.set("Content-Type", "application/json");
        HttpEntity<OpenAiRequest> entity = new HttpEntity<>(request, headers);

        // 만약 tts면 byte[]로 바꿔야함 (HttpEntity를)

        OpenAiResponse response = restTemplate
                .postForObject(API_URL, entity, OpenAiResponse.class);

        return response.getChoices().get(0).getMessage().getContent();
    }
}
