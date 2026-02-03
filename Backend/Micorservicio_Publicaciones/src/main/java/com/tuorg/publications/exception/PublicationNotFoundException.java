package com.tuorg.publications.exception;

public class PublicationNotFoundException extends RuntimeException {

    public PublicationNotFoundException(Long id) {
        super("Publicación no encontrada con id: " + id);
    }

    // Opcional: constructor vacío
    public PublicationNotFoundException() {
        super("Publicación no encontrada");
    }
}