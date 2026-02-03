<?php

namespace App\DTOs;
use App\Models\Author;
use Carbon\Carbon;

class AuthorResponseDTO
{
    public function __construct(
        public string $uuid,
        public string $nombre,
        public string $apellido,
        public string $email,
        public string $type,
        public bool $activo,
        public ?Carbon $createdAt = null,
        public ?Carbon $updatedAt = null,
    ) {}

    public static function fromModel(Author $author): self {
        return new self(
            uuid: $author->uuid,
            nombre: $author->nombre,
            apellido: $author->apellido,
            email: $author->email,
            type: $author->type,
            activo: $author->activo,
            createdAt: $author->created_at,
            updatedAt: $author->updated_at,
        );
    }

    /**
     * Convertir a array para respuestas JSON
     */
    public function toArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'nombreCompleto' => $this->getNombreCompleto(),
            'email' => $this->email,
            'type' => $this->type,
            'activo' => $this->activo,
            'createdAt' => $this->createdAt?->toISOString(),
            'updatedAt' => $this->updatedAt?->toISOString(),
        ];
    }

    /**
     * Versión mínima para listados
     */
    public function toMinimalArray(): array
    {
        return [
            'uuid' => $this->uuid,
            'nombreCompleto' => $this->getNombreCompleto(),
            'email' => $this->email,
            'type' => $this->type,
            'activo' => $this->activo,
        ];
    }

    /**
     * Obtener nombre completo
     */
    public function getNombreCompleto(): string
    {
        return $this->nombre . ' ' . $this->apellido;
    }

    /**
     * Convertir a JSON
     */
    public function toJson(): string
    {
        return json_encode($this->toArray(), JSON_THROW_ON_ERROR);
    }
}