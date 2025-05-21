package org.example.backproject.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NaverBlogItem {
    private String title;
    private String link;
    private String bloggername;
    private String postdate; // "yyyyMMdd" 형식의 문자열

    @Override
    public String toString() { // 디버깅용
        return "NaverBlogItem{" +
                "title='" + title + '\'' +
                ", link='" + link + '\'' +
                ", postdate='" + postdate + '\'' +
                '}';
    }
}