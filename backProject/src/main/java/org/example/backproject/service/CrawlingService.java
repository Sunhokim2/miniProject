package org.example.backproject.service;

import lombok.RequiredArgsConstructor;
import org.example.backproject.dto.ImageData;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CrawlingService {
    private static final Logger logger = LoggerFactory.getLogger(CrawlingService.class);
    
    private final ImageService imageService;
    
    // 블로그 내용과 이미지 URL을 함께 반환하는 클래스
    public static class BlogContent {
        private String text;
        private String imageUrl;

        public BlogContent(String text, String imageUrl) {
            this.text = text;
            this.imageUrl = imageUrl;
        }

        public String getText() {
            return text;
        }

        public String getImageUrl() {
            return imageUrl;
        }
    }
    
    /**
     * 이미지 URL에서 이미지 데이터 다운로드
     */
    public ImageData downloadImageFromUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            logger.warn("이미지 다운로드 실패: URL이 null이거나 비어있음");
            return null;
        }
        
        logger.info("이미지 다운로드 시작: {}", imageUrl);
        
        try {
            ImageData imageData = imageService.downloadImage(imageUrl);
            
            // 바이트 배열 유효성 검증
            if (imageData != null && imageData.getData() != null) {
                byte[] dataBytes = imageData.getData();
                int length = dataBytes.length;
                
                // 이미지 정보 로깅
                logger.info("[디버깅] 다운로드된 이미지 정보:");
                logger.info("- URL: {}", imageUrl);
                logger.info("- 바이트 배열 길이: {}", length);
                logger.info("- 바이트 배열 타입: {}", dataBytes.getClass().getName());
                logger.info("- 이미지 크기: {} 바이트", imageData.getSize());
                logger.info("- 이미지 타입: {}", imageData.getType());
                logger.info("- 이미지 이름: {}", imageData.getName());
                
                // 추가 검증 - getData()가 정말 바이트 배열을 반환하는지 확인
                if (dataBytes == null) {
                    logger.error("심각한 오류: ImageData.getData()가 null 반환");
                    return null;
                }
                
                if (!(dataBytes instanceof byte[])) {
                    logger.error("심각한 오류: ImageData.getData()가 byte[] 타입이 아님: {}", dataBytes.getClass().getName());
                    return null;
                }
                
                logger.info("이미지 다운로드 성공 완료!");
                return imageData;
            } else {
                logger.warn("이미지 다운로드 실패: 이미지 데이터가 null이거나 비어있음: {}", imageUrl);
                return null;
            }
        } catch (Exception e) {
            logger.error("이미지 다운로드 예외 발생: {}", imageUrl, e);
            return null;
        }
    }

    public Map<String, BlogContent> getBlogContent(List<String> urls) {
        Map<String, BlogContent> results = new HashMap<>();
        if(urls==null || urls.isEmpty())
            return results;

        for(String url : urls) {
            try{
                BlogContent content = extractContentFromNaverBlog(url);
                results.put(url, content);
                
                // 이미지 URL 로깅
                if (content.getImageUrl() != null && !content.getImageUrl().isEmpty()) {
                    logger.info("블로그에서 이미지 URL 추출됨: {}", content.getImageUrl());
                }
            } catch(Exception e) {
                logger.error("블로그 내용 추출 실패: {}", url, e);
                results.put(url, new BlogContent("error", ""));
            }
        }

        return results;
    }

    private BlogContent extractContentFromNaverBlog(String url) throws IOException {
        if (url == null || !url.startsWith("https://blog.naver.com/")) {
            throw new IllegalArgumentException("유효한 네이버 블로그 URL이 아닙니다: " + url);
        }

        Document doc = Jsoup.connect(url).get();
        Elements iframes = doc.select("iframe#mainFrame");
        String src = iframes.attr("src");

        String url2 = "http://blog.naver.com" + src;
        Document doc2 = Jsoup.connect(url2).get();

        String[] blog_logNo = src.split("&");
        String[] logNo_split = blog_logNo[1].split("=");
        String logNo = logNo_split[1];

        String real_blog_addr = "div#post-view" + logNo;
        Elements blog_element = doc2.select(real_blog_addr);
        
        // 블로그 본문 텍스트 추출
        String blogText = blog_element.text();
        
        // 이미지 URL 추출
        String imageUrl = extractMainImageUrl(doc2, logNo);
        
        return new BlogContent(blogText, imageUrl);
    }
    
    // 블로그에서 메인 이미지 URL 추출
    private String extractMainImageUrl(Document doc, String logNo) {
        try {
            // 블로그 본문 내의 첫 번째 이미지 찾기
            String postContentSelector = "div#post-view" + logNo + " div.se-main-container";
            Elements contentDiv = doc.select(postContentSelector);
            
            // 새로운 에디터 형식 (se-image)
            Elements seImages = contentDiv.select("div.se-module.se-module-image img");
            if (!seImages.isEmpty()) {
                Element firstImage = seImages.first();
                String imgUrl = firstImage.attr("src");
                // 일부 이미지 URL이 프록시 URL인 경우 원본 URL 추출
                if (imgUrl.contains("?type=")) {
                    imgUrl = imgUrl.split("\\?type=")[0];
                }
                return imgUrl;
            }
            
            // 이전 에디터 형식 (old-style)
            Elements oldImages = contentDiv.select("div.se_component_wrap img.se_mediaImage");
            if (!oldImages.isEmpty()) {
                return oldImages.first().attr("src");
            }
            
            // 더 이전 에디터 형식
            Elements legacyImages = doc.select("div#post-view" + logNo + " img");
            if (!legacyImages.isEmpty()) {
                return legacyImages.first().attr("src");
            }
            
            return "";
        } catch (Exception e) {
            logger.error("이미지 URL 추출 실패", e);
            return "";
        }
    }
}
