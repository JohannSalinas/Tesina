<?php
// app/Http/Controllers/EncuestaController.php

namespace App\Http\Controllers;

use App\Models\Encuesta;
use Illuminate\Http\Request;

class EncuestaController extends Controller
{
    // Mostrar todas las encuestas
    public function index()
    {
        $encuestas = Encuesta::all(); // Aquí puedes agregar paginación o filtros
        return view('encuestas.index', compact('encuestas')); // Cambia la vista según tu estructura
    }

    // Mostrar el formulario para crear una nueva encuesta
    public function create()
    {
        return view('encuestas.create'); // Cambia la vista según tu estructura
    }

    // Almacenar una nueva encuesta
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'preguntas' => 'required|string', // Aquí puedes agregar validación según el formato de preguntas
            'user_id' => 'required|exists:users,id', // Validamos que el id_usuario exista en la tabla users
        ]);

        // Crear la nueva encuesta
        Encuesta::create($validatedData);

        // Redirigir a la lista de encuestas con un mensaje de éxito
        return redirect()->route('encuestas.index')->with('success', 'Encuesta creada con éxito.');
    }

    // Mostrar el formulario para editar una encuesta
    public function edit($id)
    {
        $encuesta = Encuesta::findOrFail($id);
        return view('encuestas.edit', compact('encuesta')); // Cambia la vista según tu estructura
    }

    // Actualizar una encuesta existente
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'preguntas' => 'required|string',
            'user_id' => 'required|exists:users,id',
        ]);

        $encuesta = Encuesta::findOrFail($id);
        $encuesta->update($validatedData);

        return redirect()->route('encuestas.index')->with('success', 'Encuesta actualizada con éxito.');
    }

    // Eliminar una encuesta
    public function destroy($id)
    {
        $encuesta = Encuesta::findOrFail($id);
        $encuesta->delete();

        return redirect()->route('encuestas.index')->with('success', 'Encuesta eliminada con éxito.');
    }
}
