package org.example.backproject.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CrawlingService {
    public Map<String, String> getBlogContent(List<String> urls) {
        Map<String, String> results = new HashMap<>();
        if(urls==null || urls.isEmpty())
            return results;

        for(String url : urls) {
            try{
                String content = extractContentFromNaverBlog(url);
                results.put(url, content);
            }catch(Exception e){
                results.put(url, "error");
            };
        }


        return results;
    }

    private String extractContentFromNaverBlog(String url) throws IOException {
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

        return blog_element.text();
    }
}
