package com.tuorg.publications.dto;

import com.tuorg.publications.entity.PublicationStatus;


public class PublicationResponseDTO {

    private Long id;
    private String title;
    private String content;
    private PublicationStatus status;
    private String authorId;

        // GETTERS
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public PublicationStatus getStatus() { return status; }
    public String getAuthorId() { return authorId; }

    // SETTERS
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setStatus(PublicationStatus status) { this.status = status; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }
}


