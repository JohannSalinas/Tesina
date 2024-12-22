<?php

// app/Models/Encuesta.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Encuesta extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descripcion',
        'preguntas',
        'user_id', // Asegurándonos de que el campo 'user_id' esté asignado
    ];

    // Definimos la relación con el modelo de Usuario (User)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
