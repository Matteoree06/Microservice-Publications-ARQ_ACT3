<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAuthorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Permitir todas las peticiones
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => [
                'required',
                'string',
                'min:2',
                'max:50',
                'regex:/^[a-zA-ZÁÉÍÓÚáéíóúñÑüÜ\s]+$/' // Solo letras, acentos y espacios
            ],
            'apellido' => [
                'required',
                'string',
                'min:2',
                'max:50',
                'regex:/^[a-zA-ZÁÉÍÓÚáéíóúñÑüÜ\s]+$/' // Solo letras, acentos y espacios
            ],
            'email' => [
                'required',
                'email',
                'max:100',
                'unique:authors,email' // Validar que el email sea único
            ],
            'type' => [
                'sometimes', // Opcional
                'string',
                'in:regular,premium,admin' // Solo tipos permitidos
            ],
            'activo' => [
                'sometimes', // Opcional
                'boolean'
            ]
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.min' => 'El nombre debe tener al menos 2 caracteres',
            'nombre.max' => 'El nombre no puede tener más de 50 caracteres',
            'nombre.regex' => 'El nombre solo puede contener letras, acentos y espacios',
            
            'apellido.required' => 'El apellido es obligatorio',
            'apellido.min' => 'El apellido debe tener al menos 2 caracteres',
            'apellido.max' => 'El apellido no puede tener más de 50 caracteres',
            'apellido.regex' => 'El apellido solo puede contener letras, acentos y espacios',
            
            'email.required' => 'El email es obligatorio',
            'email.email' => 'El email debe tener un formato válido',
            'email.max' => 'El email no puede tener más de 100 caracteres',
            'email.unique' => 'Este email ya está registrado',
            
            'type.in' => 'El tipo de autor debe ser: regular, premium o admin',
            'activo.boolean' => 'El campo activo debe ser verdadero o falso'
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'nombre' => $this->nombre ? trim($this->nombre) : null,
            'apellido' => $this->apellido ? trim($this->apellido) : null,
            'email' => $this->email ? strtolower(trim($this->email)) : null,
            'type' => $this->type ?? 'regular', // Valor por defecto
            'activo' => $this->activo ?? true // Valor por defecto
        ]);
    }
}
