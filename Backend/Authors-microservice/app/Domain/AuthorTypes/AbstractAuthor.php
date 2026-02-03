<?php

namespace App\Domain\AuthorTypes;

abstract class AbstractAuthor
{
    protected string $uuid;
    protected string $nombre;
    protected string $apellido;
    protected string $email;
    protected string $type;
    protected bool $activo;

    protected function __construct(
        string $uuid, 
        string $nombre, 
        string $apellido, 
        string $email, 
        string $type,
        bool $activo
    ) {
        $this->uuid = $uuid;
        $this->nombre = $nombre;
        $this->apellido = $apellido;
        $this->email = $email;
        $this->type = $type;
        $this->activo = $activo;
    }

    // Getters
    public function getUuid(): string
    {
        return $this->uuid;
    }

    public function getNombre(): string
    {
        return $this->nombre;
    }

    public function getApellido(): string
    {
        return $this->apellido;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function isActivo(): bool
    {
        return $this->activo;
    }

    /**
     * Método común para obtener nombre completo
     */
    public function getNombreCompleto(): string
    {
        return $this->nombre . ' ' . $this->apellido;
    }

    // MÉTODO ABSTRACTO SIMPLE - Solo para cumplir el patrón
    /**
     * Descripción del tipo de autor
     */
    abstract public function getDescription(): string;

    /**
     * Método común para convertir a array básico
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
            'description' => $this->getDescription(),
        ];
    }
}