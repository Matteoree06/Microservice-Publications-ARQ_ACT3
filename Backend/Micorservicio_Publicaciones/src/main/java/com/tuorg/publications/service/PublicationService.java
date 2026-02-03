package com.tuorg.publications.service;

import java.util.List;

import com.tuorg.publications.dto.PublicationRequestDTO;
import com.tuorg.publications.dto.PublicationResponseDTO;
import com.tuorg.publications.entity.PublicationStatus;


public interface PublicationService {

    PublicationResponseDTO create(PublicationRequestDTO dto);

    PublicationResponseDTO findById(Long id);

    List<PublicationResponseDTO> findAll();

    PublicationResponseDTO updateStatus(Long id, PublicationStatus status);
}


