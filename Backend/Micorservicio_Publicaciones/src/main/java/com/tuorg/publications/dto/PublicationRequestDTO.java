package com.tuorg.publications.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;


public class PublicationRequestDTO {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotNull
    private String authorId;

 // ===== GETTERS =====
    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public String getAuthorId() {
        return authorId;
    }

    // ===== SETTERS =====
    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }
}


