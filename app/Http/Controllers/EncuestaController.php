<?php

namespace App\Http\Controllers;

use App\Models\Encuesta;
use App\Models\PreguntaEncuesta;
use App\Models\RespuestasEncuesta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class EncuestaController extends Controller
{
    /**
     * Lista todas las encuestas.
     */
    public function index()
{
    $encuestas = Encuesta::with('preguntas')->get();  // Cargar las preguntas asociadas a las encuestas
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
        'numPreguntas' => 'required|integer|min:1',
        'preguntas' => 'required|array', // Validamos que preguntas sea un array
        'preguntas.*' => 'required|string|max:255', // Validamos cada pregunta individualmente
    ]);

    // Guardar encuesta
    $encuesta = Encuesta::create([
        'titulo' => $request->titulo,
        'descripcion' => $request->descripcion,
        'num_preguntas' => $request->numPreguntas,
        'user_id' => Auth::id(),
    ]);

    // Guardar las preguntas asociadas a la encuesta
    foreach ($request->preguntas as $pregunta) {
        $encuesta->preguntas()->create([
            'pregunta' => $pregunta,
        ]);
    }

    return redirect()->route('encuestas.index')->with('success', 'Encuesta creada correctamente.');
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

    /**
     * Muestra la vista para editar una encuesta.
     */
    public function edit($id)
    {
        // Recupera la encuesta junto con las preguntas relacionadas
        $encuesta = Encuesta::with('preguntas')->findOrFail($id);
        
        // Pasa la encuesta con las preguntas al frontend
        return inertia('EditarEncuesta', ['encuesta' => $encuesta]);
    }

    /**
     * Actualiza la encuesta.
     */
    public function update(Request $request, $id)
    {
        // Validación de los datos
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'preguntas' => 'nullable|array|min:1', // Asegura que las preguntas sean un array
            'preguntas.*' => 'nullable|string|max:255', // Cada pregunta debe ser una cadena de texto
        ]);

        // Encontrar la encuesta
        $encuesta = Encuesta::findOrFail($id);

        // Actualizar la encuesta
        $encuesta->update($request->only(['titulo', 'descripcion']));

        // Si se han enviado preguntas, actualizarlas
        if ($request->has('preguntas')) {
            // Eliminar las preguntas existentes
            PreguntaEncuesta::where('encuesta_id', $encuesta->id)->delete();

            // Guardar las nuevas preguntas
            foreach ($request->preguntas as $pregunta) {
                PreguntaEncuesta::create([
                    'encuesta_id' => $encuesta->id,
                    'pregunta' => $pregunta,
                ]);
            }
        }

        return redirect()->route('encuestas.index')->with('success', 'Encuesta actualizada correctamente.');
    }


    public function obtenerEncuestas()
    {
    $encuestas = Encuesta::with('preguntas_encuesta')->get(); // Carga las encuestas con las preguntas relacionadas
    return inertia('Profesor/ListaEncuesta', [
        'encuestas' => $encuestas,
    ]);
    }

    public function responder(Request $request, $id)
{
    $encuesta = Encuesta::find($id);

    if (!$encuesta) {
        return response()->json(['error' => 'Encuesta no encontrada'], 404);
    }

    // Validar las respuestas
    $validated = $request->validate([
        'respuestas' => 'required|array',
        'respuestas.*' => 'in:Totalmente de acuerdo,De acuerdo,Neutral,En desacuerdo,Totalmente en desacuerdo',
    ]);

    // Guardar las respuestas
    foreach ($validated['respuestas'] as $preguntaId => $respuesta) {
        RespuestasEncuesta::create([
            'encuesta_id' => $encuesta->id,
            'pregunta_id' => $preguntaId,
            'respuesta' => $respuesta,
        ]);
    }

    return response()->json(['message' => 'Respuestas enviadas con éxito']);
}
}
