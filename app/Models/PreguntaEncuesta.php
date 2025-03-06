<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreguntaEncuesta extends Model
{
    use HasFactory;

    // Tabla asociada
    protected $table = 'preguntas_encuesta';

    // Asignación masiva permitida
    protected $fillable = ['encuesta_id', 'pregunta'];

    // Relación con el modelo Encuesta
    public function encuesta()
    {
        return $this->belongsTo(Encuesta::class);
    }
}
