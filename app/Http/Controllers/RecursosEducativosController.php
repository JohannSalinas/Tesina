<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RecursoEducativo;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\GrupoUsuario; // Para obtener los grupos del usuario
use App\Models\GrupoColaborador; // Si se necesita el grupo completo
use Illuminate\Support\Facades\Auth;

class RecursosEducativosController extends Controller
{
    public function index()
    {
        $userId = auth()->id(); // Obtener el ID del usuario autenticado

        // Obtener los grupos a los que pertenece el usuario
        $grupos = GrupoUsuario::where('usuario_id', $userId)->get();
        $nombreGrupos = GrupoColaborador::whereIn('id', $grupos->pluck('grupo_id'))
            ->get(['id', 'nombre']);

        // Obtener todos los recursos educativos con la relación del usuario
        $recursos = RecursoEducativo::with('user:id,nombre')->get();
        return Inertia::render('RecursosEducativos', [
            'recursos' => $recursos,
            'grupos' => $nombreGrupos,
        ]);
    }

    public function store(Request $request)
    {
        // Validación de los datos enviados desde el formulario
        $userId = auth()->id();

        $validatedData = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'tipo' => 'required|string|in:PDF,DOCX,PPTX',
            'archivo' => 'required|file|mimes:pdf,docx,pptx|max:10240', // Máx 10MB
            'grupo_id' => 'required|exists:grupos_colaboradores,id',
        ]);

        // Guardar el archivo en 'public/recursos' y obtener la ruta
        $archivoPath = $request->file('archivo')->store('recursos', 'public');


        // Crear el recurso en la base de datos
        $recurso = RecursoEducativo::create([
            'titulo' => $validatedData['titulo'],
            'descripcion' => $validatedData['descripcion'],
            'tipo' => $validatedData['tipo'],
            'archivo_path' => $archivoPath, // Guardamos la ruta del archivo
            'grupo_colaborador_id' => $validatedData['grupo_id'],
            'user_id' => $userId,
        ]);

        return redirect()->route('recursos.index')->with('message', 'Recurso educativo creado exitosamente.');
    }

    public function edit($id)
    {
        $recurso = RecursoEducativo::findOrFail($id);
        return Inertia::render('EditarRecursoEducativo', [
            'recurso' => $recurso,
        ]);
    }

    public function update(Request $request, $id)
    {
        $recurso = RecursoEducativo::findOrFail($id);

        // Agregar la línea de log para ver los datos recibidos
        \Log::info('Datos recibidos para actualización:', $request->all());

        $validator = Validator::make($request->all(), [
            'titulo' => 'required|max:255',
            'descripcion' => 'nullable|max:1000',
            'tipo' => 'required|in:PDF,DOCX,PPTX,Enlace Web',  // Validación correcta
            'archivo' => 'nullable|file|max:10240',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Verificar si se proporcionó un nuevo archivo y manejar la actualización
        $archivoPath = $recurso->url;  // Asignar la URL actual por defecto
        if ($request->hasFile('archivo')) {
            // Eliminar el archivo anterior si existe
            $this->deleteFile($recurso->url);
            // Almacenar el nuevo archivo y obtener su ruta
            $archivoPath = $request->file('archivo')->store('recursos', 'public');
        }

        // Actualizar el recurso con los nuevos datos
        $recurso->update([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'tipo' => $request->tipo,
            'url' => $archivoPath,  // Se usa la nueva URL del archivo si fue cargado
        ]);

        return redirect()->route('recursos.index')->with('message', 'Recurso educativo actualizado exitosamente.');
    }

    public function destroy($id)
    {
        $recurso = RecursoEducativo::findOrFail($id);

        // Eliminar el archivo asociado al recurso
        $this->deleteFile($recurso->url);

        $recurso->delete();

        return redirect()->route('recursos.index')->with('message', 'Recurso educativo eliminado exitosamente.');
    }

    private function deleteFile($filePath)
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }
    }

    public function recursosProfesor()
    {
        $userId = Auth::id();

        // Obtener los grupos en los que el profesor está inscrito con sus recursos
        $grupos = GrupoColaborador::whereHas('usuarios', function ($query) use ($userId) {
            $query->where('usuario_id', $userId);
        })->with('recursos')->get();

        return Inertia::render('Profesor/ListaRecursos', [
            'grupos' => $grupos
        ]);
    }

    public function calificar(Request $request, RecursoEducativo $recurso)
{
    $request->validate([
        'calificacion' => 'required|numeric|min:0|max:5',
    ]);

    // Actualizar la calificación del recurso
    $recurso->calificacion = $request->calificacion;
    $recurso->save();

    return response()->json(['message' => 'Calificación actualizada con éxito']);
}

}
