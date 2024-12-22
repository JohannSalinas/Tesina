<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RecursoEducativo;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class RecursosEducativosController extends Controller
{
    public function index()
    {
        $recursos = RecursoEducativo::all();
        return Inertia::render('RecursosEducativos/Index', [
            'recursos' => $recursos
        ]);
    }

    public function create()
    {
        return Inertia::render('RecursosEducativos/Create');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|max:255',
            'descripcion' => 'nullable|max:1000',
            'tipo' => 'required|in:PDF,DOCX,PPTX,Enlace Web',
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

        // Crear el recurso educativo, asignando el user_id
        RecursoEducativo::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'tipo' => $request->tipo,
            'url' => $archivoPath ?? $request->url,  // Se usa el archivo si existe, sino usa la URL
            'user_id' => auth()->id()  // Asignar el user_id del usuario autenticado
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
}
