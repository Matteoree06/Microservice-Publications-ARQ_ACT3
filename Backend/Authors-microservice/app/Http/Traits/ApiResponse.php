<?php

namespace App\Http\Traits;

trait ApiResponse
{
    protected function success($data = null, string $message = null, int $status = 200)
    {
        $response = [];
        
        if ($message) {
            $response['message'] = $message;
        }
        
        if ($data !== null) {
            if (is_array($data) && isset($data['data'])) {
                // Si ya tiene estructura data/total
                $response = array_merge($response, $data);
            } else {
                $response['data'] = $data;
            }
        }
        
        return response()->json($response, $status);
    }
    
    protected function created($data, string $message = 'Creado exitosamente')
    {
        return $this->success($data, $message, 201);
    }
    
    protected function notFound(string $message = 'No encontrado')
    {
        return response()->json(['message' => $message], 404);
    }
    
    protected function error(string $message = 'Error interno', int $status = 500)
    {
        return response()->json(['message' => $message], $status);
    }
}