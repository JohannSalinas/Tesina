<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrupoColaborador extends Model
{
    use HasFactory;

    // Especificamos explícitamente el nombre de la tabla
    protected $table = 'grupos_colaboradores';

    // Definir los campos que pueden ser asignados masivamente
    protected $fillable = [
        'nombre',
        'tipo',
        'descripcion',
        'temas_abordados',
        'numero_inscritos',
    ];

    // Si estás usando una relación con usuarios a través de la tabla pivote 'grupo_usuario',
    // puedes agregar una relación aquí, por ejemplo:
    public function usuarios()
    {
        return $this->belongsToMany(User::class, 'grupo_usuario', 'grupo_id', 'usuario_id');
    }
}
