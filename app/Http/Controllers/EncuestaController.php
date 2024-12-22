<?php

namespace App\Http\Controllers;

use App\Models\Encuesta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EncuestaController extends Controller
{
    /**
     * Lista todas las encuestas.
     */
    public function index()
    {
        $encuestas = Encuesta::all();
        return inertia('GestionEncuestas', ['encuestas' => $encuestas]);
    }

    /**
     * Guarda una nueva encuesta.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'preguntas' => 'nullable|string',
        ]);

        Encuesta::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'preguntas' => $request->preguntas,
            'user_id' => Auth::id(), // Usuario autenticado
        ]);

        return redirect()->back()->with('success', 'Encuesta creada correctamente.');
    }

    /**
     * Elimina una encuesta.
     */
    public function destroy($id)
    {
        $encuesta = Encuesta::findOrFail($id);
        $encuesta->delete();

        return redirect()->back()->with('success', 'Encuesta eliminada correctamente.');
    }

    public function edit($id)
{
    $encuesta = Encuesta::findOrFail($id);
    return inertia('EditarEncuesta', ['encuesta' => $encuesta]);
}

/**
 * Actualiza la encuesta.
 */
public function update(Request $request, $id)
{
    $request->validate([
        'titulo' => 'required|string|max:255',
        'descripcion' => 'nullable|string',
        'preguntas' => 'nullable|string',
    ]);

    $encuesta = Encuesta::findOrFail($id);
    $encuesta->update($request->all());

    return redirect()->route('encuestas.index')->with('success', 'Encuesta actualizada correctamente.');
}


}
