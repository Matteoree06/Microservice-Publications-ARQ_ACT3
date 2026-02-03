<?php

namespace App\Services;
use App\DTOs\CreateAuthorDTO;
use App\DTOs\AuthorResponseDTO;
use App\Repositories\AuthorRepository;
use App\Domain\AuthorTypes\AbstractAuthor;
use App\Domain\AuthorTypes\RegularAuthor;
use App\Exceptions\EmailAlreadyExistsException;
use Illuminate\Support\Str;
use Exception;

class AuthorService
{
    private AuthorRepository $authorRepository;

    public function __construct(AuthorRepository $authorRepository)
    {
        $this->authorRepository = $authorRepository;
    }

    public function createAuthor(CreateAuthorDTO $createAuthorDTO): AuthorResponseDTO
    {
        $createAuthorDTO->validate();

        if ($this->authorRepository->emailExists($createAuthorDTO->email)) {
            throw new EmailAlreadyExistsException($createAuthorDTO->email);
        }

        $uuid = (string) Str::uuid();
        
        $authorType = $this->createAuthorType(
            $createAuthorDTO->type,
            $uuid,
            $createAuthorDTO->nombre,
            $createAuthorDTO->apellido,
            $createAuthorDTO->email,
            $createAuthorDTO->activo
        );

        $authorModel = $this->authorRepository->create($authorType);
        return AuthorResponseDTO::fromModel($authorModel);
    }

    private function createAuthorType(
        string $type,
        string $uuid,
        string $nombre,
        string $apellido,
        string $email,
        bool $activo
    ): AbstractAuthor {
        return match($type) {
            'regular' => new RegularAuthor($uuid, $nombre, $apellido, $email, $activo),
            default => throw new Exception("Tipo de autor no soportado: {$type}")
        };
    }

    public function getAuthorByUuid(string $uuid): ?AuthorResponseDTO
    {
        $authorModel = $this->authorRepository->findByUuid($uuid);
        return $authorModel ? AuthorResponseDTO::fromModel($authorModel) : null;
    }

    public function getAllAuthors(): array
    {
        $authorModels = $this->authorRepository->findAll();
        $authorDTOs = [];
        
        foreach ($authorModels as $authorData) {
            if (is_array($authorData)) {
                $authorModel = new \App\Models\Author($authorData);
                $authorModel->exists = true;
            } else {
                $authorModel = $authorData;
            }
            $authorDTOs[] = AuthorResponseDTO::fromModel($authorModel);
        }
        
        return $authorDTOs;
    }

    public function authorExists(string $uuid): bool
    {
        return $this->authorRepository->findByUuid($uuid) !== null;
    }

    public function getActiveAuthors(): array
    {
        $activeAuthorsData = $this->authorRepository->findActive();
        $authorDTOs = [];
        
        foreach ($activeAuthorsData as $authorData) {
            if (is_array($authorData)) {
                $authorModel = new \App\Models\Author($authorData);
                $authorModel->exists = true;
            } else {
                $authorModel = $authorData;
            }
            $authorDTOs[] = AuthorResponseDTO::fromModel($authorModel);
        }
        
        return $authorDTOs;
    }
}