<?php

namespace App\Exceptions;

use Exception;

class EmailAlreadyExistsException extends Exception
{
    public function __construct(string $email)
    {
        parent::__construct("El email '{$email}' ya está registrado", 409);
    }

    public function render()
    {
        return response()->json([
            'message' => $this->getMessage()
        ], $this->getCode());
    }
}