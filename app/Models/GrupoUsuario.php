<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GrupoUsuario extends Model
{
    use HasFactory;

    protected $table = 'grupo_usuario';

    protected $fillable = [
        'grupo_id',
        'usuario_id',
    ];

    /**
     * Relación inversa con GrupoColaborador.
     */
    public function grupo()
    {
        return $this->belongsTo(GrupoColaborador::class, 'grupo_id');
    }

    /**
     * Relación inversa con User.
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
