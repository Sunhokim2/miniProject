package com.example.crawling;

import java.io.IOException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Crawling {
    @GetMapping("/crawl")
    public static void getPost() throws IOException {
        // 네이버 블로그 url로 document가져오기
        String url = "https://blog.naver.com/wlgus3651/223570456098"; // 블로그 주소 입력하기 hard coding request param 등으로 입력 받도록 수정해야함!
        Document doc = Jsoup.connect(url).get();

        // iframe 태그에 있는 진짜 블로그 주소 가져오기
        Elements iframes = doc.select("iframe#mainFrame");
        String src = iframes.attr("src");
        // 진짜 블로그 주소 document 가져오기
        String url2 = "http://blog.naver.com" + src;
        Document doc2 = Jsoup.connect(url2).get();
        System.out.println("주소 확인용 : " + url2);

        // 블로그에서 원하는 블로그 페이지 가져오기
        String[] blog_logNo = src.split("&");
        String[] logNo_split = blog_logNo[1].split("=");
        String logNo = logNo_split[1];

        // 찾고자 하는 블로그 본문 가져오기
        String real_blog_addr = "div#post-view" + logNo;
        Elements blog_element = doc2.select(real_blog_addr);
        System.out.println(blog_element.text());

        // String og_image =
        // doc2.select("meta[property=og:image]").get(0).attr("content");
        // System.out.println("og_image : " + og_image);
    }

}
