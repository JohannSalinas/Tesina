<?php

namespace App\Http\Controllers;

use App\Models\RespuestaForo;
use App\Models\PreguntaForo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RespuestaForoController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'pregunta_id' => 'required|exists:preguntas_foro,id',
        'respuesta' => 'required|string',
    ]);

    $pregunta = PreguntaForo::findOrFail($request->pregunta_id);

    // Contar las respuestas actuales
    if ($pregunta->respuestas()->count() >= $pregunta->max_respuestas) {
        return response()->json(['error' => 'Se ha alcanzado el límite de respuestas para esta pregunta.'], 403);
    }

    // Crear la respuesta
    RespuestaForo::create([
        'pregunta_id' => $request->pregunta_id,
        'usuario_id' => auth()->id(),
        'respuesta' => $request->respuesta,
    ]);

    // Incrementar el contador de respuestas en la pregunta
    $pregunta->increment('numero_respuestas');

    return redirect()->route('preguntas.show', $pregunta->id)->with('success', 'Respuesta enviada.');
}

// Eliminar una respuesta
public function destroy($id)
{
    $respuesta = RespuestaForo::findOrFail($id);

    // Verificar si el usuario es el creador de la respuesta
    if ($respuesta->usuario_id !== Auth::id()) {
        return redirect()->back()->with('error', 'No tienes permiso para eliminar esta respuesta.');
    }

    $pregunta = $respuesta->preguntaForo;

    $respuesta->delete();

    // Disminuir el contador de respuestas en la pregunta
    $pregunta->decrement('numero_respuestas');

    return redirect()->route('preguntas.show', $pregunta->id)->with('success', 'Respuesta eliminada.');
}

}
