<?php

namespace App\Repositories;

use App\Domain\AuthorTypes\AbstractAuthor;
use App\Models\Author;

interface AuthorRepository
{
    /**
     * Crear un nuevo autor
     */
    public function create(AbstractAuthor $author): Author;
    
    /**
     * Buscar autor por UUID
     */
    public function findByUuid(string $uuid): ?Author;

    /**
     * Obtener todos los autores
     */
    public function findAll(): array;
    
    /**
     * Verificar si existe un autor por UUID
     */
    public function exists(string $uuid): bool;
    
    /**
     * Verificar si existe un email
     */
    public function emailExists(string $email): bool;
    
    /**
     * Obtener autores activos solamente
     */
    public function findActive(): array;
}