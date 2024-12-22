<?php

namespace App\Http\Controllers;

use App\Models\Encuesta;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EncuestaController extends Controller
{
    // Mostrar la lista de encuestas
    public function index()
    {
        $encuestas = Encuesta::all(); // Obtener todas las encuestas
        return Inertia::render('GestionEncuestas', [
            'encuestas' => $encuestas,
        ]);
    }

    // Mostrar el formulario de creación de encuesta
    public function create()
    {
        return Inertia::render('CrearEncuesta');
    }

    // Almacenar la encuesta en la base de datos
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'preguntas' => 'nullable|string',
        ]);

        // Crear una nueva encuesta
        Encuesta::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'preguntas' => $request->preguntas,
            'user_id' => auth()->id(), // El ID del usuario autenticado
        ]);

        return redirect()->route('encuestas.index');
    }

    // Mostrar el formulario para editar la encuesta
    public function edit($id)
    {
        $encuesta = Encuesta::findOrFail($id);
        return Inertia::render('EditarEncuesta', [
            'encuesta' => $encuesta,
        ]);
    }

    // Actualizar una encuesta existente
    public function update(Request $request, $id)
    {
        $encuesta = Encuesta::findOrFail($id);

        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'preguntas' => 'nullable|string',
        ]);

        $encuesta->update([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'preguntas' => $request->preguntas,
        ]);

        return redirect()->route('encuestas.index');
    }

    // Eliminar una encuesta
    public function destroy($id)
    {
        $encuesta = Encuesta::findOrFail($id);
        $encuesta->delete();

        return redirect()->route('encuestas.index');
    }
}
