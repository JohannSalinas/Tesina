<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RecursoEducativo;
use App\Models\GrupoColaborador;
use App\Models\GrupoUsuario;

class DashboardController extends Controller
{
    public function index()
    {
        // Obtener los 5 recursos más nuevos
        $recursosNuevos = RecursoEducativo::orderBy('created_at', 'desc')->take(5)->get();

        // Obtener los 5 recursos mejor calificados
        $recursosMejorCalificados = RecursoEducativo::orderByDesc('calificacion')->take(5)->get();

        // Obtener los 5 grupos con más miembros
        $gruposMasGrandes = GrupoColaborador::withCount('usuarios') // Cuenta los usuarios en cada grupo
            ->orderByDesc('usuarios_count') // Ordena por la cantidad de miembros
            ->take(5) // Obtiene solo los 5 primeros
            ->get();

        return Inertia::render('Dashboard', [
            'recursosNuevos' => $recursosNuevos,
            'recursosMejorCalificados' => $recursosMejorCalificados,
            'gruposMasGrandes' => $gruposMasGrandes
        ]);
    }
}
