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

    public function grupoUsuarios()
    {
        return $this->hasMany(GrupoUsuario::class, 'grupo_id');
    }
}
