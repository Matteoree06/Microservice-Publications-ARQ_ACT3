<?php

namespace App\Exceptions;

use Exception;

class AuthorNotFoundException extends Exception
{
    public function __construct(string $uuid)
    {
        parent::__construct("Autor con UUID '{$uuid}' no encontrado", 404);
    }

    public function render()
    {
        return response()->json([
            'message' => $this->getMessage()
        ], $this->getCode());
    }
}