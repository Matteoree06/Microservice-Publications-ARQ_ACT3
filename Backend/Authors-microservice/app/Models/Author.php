<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Author extends Model
{
    protected $table = 'authors';

    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'uuid',
        'nombre',
        'apellido',
        'email',
        'type',
        'activo'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model){
            if(empty($model->uuid)){
                $model->uuid = (string) Str::uuid();
            }
        });
    }

}
