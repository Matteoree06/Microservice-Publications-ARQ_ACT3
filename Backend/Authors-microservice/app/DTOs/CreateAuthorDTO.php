<?php

namespace App\DTOs;

class CreateAuthorDTO
{
    public function __construct(
        public string $nombre,
        public string $apellido,
        public string $email,
        public string $type = 'regular',
        public bool $activo = true,
    ) {
        $this->nombre = trim($this->nombre);
        $this->apellido = trim($this->apellido);
        $this->email = strtolower(trim($this->email));
    }

    /**
     * Crear desde array de request
     */
    public static function fromArray(array $data): self
    {
        return new self(
            nombre: $data['nombre'] ?? '',
            apellido: $data['apellido'] ?? '',
            email: $data['email'] ?? '',
            type: $data['type'] ?? 'regular',
            activo: $data['activo'] ?? true,
        );
    }

    /**
     * Validar datos del DTO
     */
    public function validate(): array
    {
        $errors = [];

        if (empty($this->nombre)) {
            $errors['nombre'] = 'El nombre es obligatorio';
        } elseif (strlen($this->nombre) < 2) {
            $errors['nombre'] = 'El nombre debe tener al menos 2 caracteres';
        }

        if (empty($this->apellido)) {
            $errors['apellido'] = 'El apellido es obligatorio';
        } elseif (strlen($this->apellido) < 2) {
            $errors['apellido'] = 'El apellido debe tener al menos 2 caracteres';
        }

        if (empty($this->email)) {
            $errors['email'] = 'El email es obligatorio';
        } elseif (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'El email no tiene un formato válido';
        }

        if (!in_array($this->type, ['regular', 'premium', 'admin'])) {
            $errors['type'] = 'El tipo de autor debe ser: regular, premium o admin';
        }

        if (!empty($errors)) {
            throw new \InvalidArgumentException('Datos inválidos: ' . json_encode($errors));
        }

        return $errors;
    }

    /**
     * Convertir a array
     */
    public function toArray(): array
    {
        return [
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
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
}

