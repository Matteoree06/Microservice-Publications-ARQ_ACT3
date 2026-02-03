<?php

namespace App\Repositories;
use App\Domain\AuthorTypes\AbstractAuthor;
use App\Models\Author;

class EloquentAuthorRepository implements AuthorRepository
{
    public function create(AbstractAuthor $author): Author
    {
        $authorModel = new Author();
        $authorModel->uuid = $author->getUuid();
        $authorModel->nombre = $author->getNombre();
        $authorModel->apellido = $author->getApellido();
        $authorModel->email = $author->getEmail();
        $authorModel->type = $author->getType();
        $authorModel->activo = $author->isActivo();
        $authorModel->save();

        return $authorModel;
    }

    public function findByUuid(string $uuid): ?Author
    {
        return Author::where('uuid', $uuid)->first();
    }

    public function findAll(): array
    {
        return Author::orderBy('created_at', 'desc')->get()->toArray();
    }
    
    public function exists(string $uuid): bool
    {
        return Author::where('uuid', $uuid)->exists();
    }
    
    public function emailExists(string $email): bool
    {
        return Author::where('email', $email)->exists();
    }
    
    public function findActive(): array
    {
        return Author::where('activo', true)
            ->orderBy('nombre')
            ->get()
            ->toArray();
    }
}