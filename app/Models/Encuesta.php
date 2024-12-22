<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Encuesta extends Model
{
    use HasFactory;

    // Definir los campos que se pueden asignar de forma masiva
    protected $fillable = [
        'titulo',
        'descripcion',
        'preguntas',
        'user_id',
    ];

    // Relación: Una encuesta pertenece a un usuario (user)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
