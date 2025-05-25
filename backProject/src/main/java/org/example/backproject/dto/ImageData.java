package org.example.backproject.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * 이미지 데이터 및 메타데이터를 담는 클래스
 */
public class ImageData {
    private byte[] data;
    private String name;
    private String type;
    private Long size;
    
    // 명시적 getter/setter 구현
    public byte[] getData() {
        return this.data;
    }
    
    public void setData(byte[] data) {
        if (data == null) {
            this.data = null;
            return;
        }
        // 방어적 복사본 생성하여 할당
        this.data = data.clone();
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public Long getSize() {
        return size;
    }
    
    public void setSize(Long size) {
        this.size = size;
    }
} 