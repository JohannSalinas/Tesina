<?php

namespace App\Http\Controllers;

use App\Models\GrupoUsuario;
use Illuminate\Http\Request;

class GrupoUsuarioController extends Controller
{
    // Mostrar todos los usuarios en un grupo específico
    public function index($grupo_id)
{
    $grupoUsuarios = GrupoUsuario::where('grupo_id', $grupo_id)->with('usuario')->get();
    return response()->json($grupoUsuarios);
}

    // Vincular un usuario a un grupo
    public function store(Request $request, $grupo_id)
    {
        $validated = $request->validate([
            'usuario_id' => 'required|exists:users,id',
        ]);

        $grupoUsuario = GrupoUsuario::create([
            'grupo_id' => $grupo_id,
            'usuario_id' => $validated['usuario_id'],
        ]);

        return response()->json($grupoUsuario, 201);
    }

    // Desvincular un usuario de un grupo
    public function destroy($grupo_id, $usuario_id)
    {
        $grupoUsuario = GrupoUsuario::where('grupo_id', $grupo_id)
                                     ->where('usuario_id', $usuario_id)
                                     ->first();

        if ($grupoUsuario) {
            $grupoUsuario->delete();
            return response()->json(['message' => 'Usuario desvinculado del grupo']);
        }

        return response()->json(['message' => 'No se encontró la relación'], 404);
    }

    public function show($id)
{
    $grupoColaborador = GrupoColaborador::with('usuarios')->findOrFail($id);

    return Inertia::render('GruposUsuario', [
        'grupoColaborador' => $grupoColaborador,
        'grupoId' => $id, // Pasar el ID del grupo para que esté disponible en el frontend
    ]);
}


}
