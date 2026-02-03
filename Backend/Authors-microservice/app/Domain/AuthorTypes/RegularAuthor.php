<?php

namespace App\Domain\AuthorTypes;

class RegularAuthor extends AbstractAuthor
{
    public function __construct(
        string $uuid, 
        string $nombre, 
        string $apellido, 
        string $email, 
        bool $activo
    ) {
        parent::__construct($uuid, $nombre, $apellido, $email, 'regular', $activo);
    }

    /**
     * Descripción simple del tipo de autor
     */
    public function getDescription(): string
    {
        return "Autor regular del sistema editorial";
    }
}