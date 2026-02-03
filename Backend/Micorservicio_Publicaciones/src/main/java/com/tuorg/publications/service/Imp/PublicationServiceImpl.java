package com.tuorg.publications.service.Imp;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.tuorg.publications.dto.PublicationRequestDTO;
import com.tuorg.publications.dto.PublicationResponseDTO;
import com.tuorg.publications.entity.Publication;
import com.tuorg.publications.entity.PublicationStatus;
import com.tuorg.publications.exception.AuthorNotFoundException;
import com.tuorg.publications.exception.PublicationNotFoundException;
import com.tuorg.publications.repository.PublicationRepository;
import com.tuorg.publications.service.PublicationService;

@Service
public class PublicationServiceImpl implements PublicationService {

    private final PublicationRepository repository;
    private final RestTemplate restTemplate;

    public PublicationServiceImpl(PublicationRepository repository,
                                  RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    @Override
    public PublicationResponseDTO create(PublicationRequestDTO dto) {

        validateAuthor(dto.getAuthorId());

        Publication publication = new Publication();
        publication.setTitle(dto.getTitle());
        publication.setContent(dto.getContent());
        publication.setAuthorId(dto.getAuthorId());
        publication.setStatus(PublicationStatus.DRAFT);

        return mapToDTO(repository.save(publication));
    }

@Value("${author.service.url}")
private String authorServiceUrl;

private void validateAuthor(String authorId) {
    try {
        restTemplate.getForObject(
            authorServiceUrl + "/" + authorId,
            Void.class
        );
    } catch (HttpClientErrorException.NotFound e) {
        throw new AuthorNotFoundException("Autor no existe");
    } catch (ResourceAccessException e) {
        throw new ResponseStatusException(
            HttpStatus.SERVICE_UNAVAILABLE,
            "Servicio de autores no disponible"
        );
    }
}

    @Override
    public PublicationResponseDTO findById(Long id) {
        Publication pub = repository.findById(id)
            .orElseThrow(() -> new PublicationNotFoundException(id));
        return mapToDTO(pub);
    }

    @Override
    public List<PublicationResponseDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PublicationResponseDTO updateStatus(Long id, PublicationStatus status) {
        Publication pub = repository.findById(id)
            .orElseThrow(() -> new PublicationNotFoundException(id));

        pub.setStatus(status);
        return mapToDTO(repository.save(pub));
    }

    //  Mapper DTO
    private PublicationResponseDTO mapToDTO(Publication publication) {
        PublicationResponseDTO dto = new PublicationResponseDTO();
        dto.setId(publication.getId());
        dto.setTitle(publication.getTitle());
        dto.setContent(publication.getContent());
        dto.setStatus(publication.getStatus());
        dto.setAuthorId(publication.getAuthorId());
        return dto;
    }
}
