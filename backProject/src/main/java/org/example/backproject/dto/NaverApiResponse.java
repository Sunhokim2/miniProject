package org.example.backproject.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NaverApiResponse {
    private String lastBuildDate;
    private int total;
    private int start;
    private int display;
    private List<NaverBlogItem> items;
}
