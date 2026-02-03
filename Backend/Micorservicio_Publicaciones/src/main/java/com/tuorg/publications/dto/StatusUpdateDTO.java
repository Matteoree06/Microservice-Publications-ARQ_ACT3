package com.tuorg.publications.dto;

import jakarta.validation.constraints.NotNull;


import com.tuorg.publications.entity.PublicationStatus;


public class StatusUpdateDTO {

    @NotNull
    private PublicationStatus status;

    public PublicationStatus getStatus() {
        return status;
    }
     public void setStatus(PublicationStatus status) {
        this.status = status;
    }
}


