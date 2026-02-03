<?php

namespace App\Http\Controllers;

use App\Services\AuthorService;
use App\DTOs\CreateAuthorDTO;
use App\Http\Requests\StoreAuthorRequest;
use App\Http\Traits\ApiResponse;
use App\Exceptions\AuthorNotFoundException;
use Illuminate\Http\JsonResponse;

class AuthorController extends Controller
{
    use ApiResponse;
    
    private AuthorService $authorService;

    public function __construct(AuthorService $authorService)
    {
        $this->authorService = $authorService;
    }

    public function store(StoreAuthorRequest $request): JsonResponse
    {
        $dto = CreateAuthorDTO::fromArray($request->validated());
        $author = $this->authorService->createAuthor($dto);
        
        return $this->created($author->toArray(), 'Autor creado exitosamente');
    }

    public function show(string $uuid): JsonResponse
    {
        $author = $this->authorService->getAuthorByUuid($uuid);
        
        if (!$author) {
            throw new AuthorNotFoundException($uuid);
        }
        
        return $this->success($author->toArray());
    }

    public function index(): JsonResponse
    {
        $authors = $this->authorService->getAllAuthors();
        $data = array_map(fn($author) => $author->toArray(), $authors);
        
        return $this->success([
            'data' => $data,
            'total' => count($data)
        ]);
    }

    public function active(): JsonResponse
    {
        $authors = $this->authorService->getActiveAuthors();
        $data = array_map(fn($author) => $author->toMinimalArray(), $authors);
        
        return $this->success([
            'data' => $data,
            'total' => count($data)
        ]);
    }

    public function exists(string $uuid): JsonResponse
    {
        $exists = $this->authorService->authorExists($uuid);
        
        return $this->success([
            'exists' => $exists,
            'uuid' => $uuid
        ]);
    }
}