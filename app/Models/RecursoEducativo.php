<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecursoEducativo extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'recursos_educativos';

    // Campos asignables masivamente
    protected $fillable = [
        'titulo', 
        'descripcion', 
        'tipo', 
        'url', 
        'user_id' // Si decides centralizar todo en `url`, elimina archivo_path
    ];

    // Relación con el usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accesor para la URL del archivo o recurso
    public function getArchivoUrlAttribute()
    {
        // Si 'url' contiene un archivo, retorna su ruta completa
        return $this->url && \Storage::exists($this->url) 
            ? \Storage::url($this->url) 
            : $this->url; // Retorna la URL como está si no es un archivo
    }

    // Scopes para filtrar por tipo
    public function scopePorTipo($query, $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    public function scopeActivos($query)
    {
        return $query->whereNotNull('url');
    }
}
