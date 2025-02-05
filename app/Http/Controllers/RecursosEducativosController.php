<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RecursoEducativo;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\GrupoUsuario; // Para obtener los grupos del usuario
use App\Models\GrupoColaborador; // Si se necesita el grupo completo

class RecursosEducativosController extends Controller
{
    public function index()
{
    $userId = auth()->id(); // Obtener el ID del usuario autenticado

    // Obtener los grupos del usuario autenticado
    $grupos = GrupoUsuario::where('user_id', $userId)
    ->join('grupos', 'grupousuario.grupo_id', '=', 'grupos.id')
    ->select('grupos.id', 'grupos.nombre')
    ->get();

    // Agregar más depuración si es necesario
    dd($grupos->toArray()); // Muestra los grupos para asegurarte de que están siendo obtenidos correctamente

    $recursos = RecursoEducativo::all(); // Obtener los recursos educativos

    return Inertia::render('RecursosEducativos/Index', [
        'recursos' => $recursos,
        'grupos' => $grupos, // Pasar los grupos al frontend
    ]);
}

    public function create()
    {
        $usuario = auth()->user();
        // Obtener los grupos en los que el usuario está inscrito a través de la tabla 'grupousuario'
        $grupos = DB::table('grupousuario')
        ->join('grupos', 'grupousuario.grupo_id', '=', 'grupos.id')
        ->where('grupousuario.user_id', $usuario->id)
        ->select('grupos.id', 'grupos.nombre')
        ->get();
    
    // Verificación de los datos
    dd($grupos->toArray());
    
        return Inertia::render('RecursosEducativos/Create', [
            'grupos' => $grupos
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|max:255',
            'descripcion' => 'nullable|max:1000',
            'tipo' => 'required|in:PDF,DOCX,PPTX,Enlace Web',
            'grupo_colaborador_id' => [
    'required',
    Rule::exists('grupos_colaboradores', 'id')->where(function ($query) {
        $userId = auth()->id();  // Obtener el ID del usuario autenticado
        $query->whereIn('id', DB::table('grupousuario')
            ->where('user_id', $userId)  // Obtener solo los grupos del usuario autenticado
            ->pluck('grupo_id')  // Obtener los IDs de los grupos
        );
    })
],
            'url' => 'nullable|url',
            'archivo' => 'nullable|file|max:10240'
        ]);
    
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
    
        $archivoPath = null;
        if ($request->hasFile('archivo')) {
            $archivoPath = $request->file('archivo')->store('recursos', 'public');
        }
    
        // Crear el recurso educativo, asignando el user_id y el grupo correspondiente
        RecursoEducativo::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'tipo' => $request->tipo,
            'url' => $archivoPath ?? $request->url,
            'grupo_colaborador_id' => $request->grupo_colaborador_id,
            'user_id' => auth()->id()
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

    public function indexProfesor()
    {
        $usuario = auth()->user();
        $gruposIds = $usuario->gruposColaboradores->pluck('id');
    
        $recursos = RecursoEducativo::whereIn('grupo_colaborador_id', $gruposIds)->get();
    
        return Inertia::render('Profesor/ListaRecursos', [
            'recursos' => $recursos
        ]);
    }



}
