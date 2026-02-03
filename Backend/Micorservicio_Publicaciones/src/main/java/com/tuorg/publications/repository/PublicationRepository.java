package com.tuorg.publications.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tuorg.publications.entity.Publication;


    @Repository
public interface PublicationRepository 
        extends JpaRepository<Publication, Long> {
}


