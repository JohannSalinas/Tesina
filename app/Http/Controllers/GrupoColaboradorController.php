<?php

namespace App\Http\Controllers;

use App\Models\GrupoColaborador;
use Inertia\Inertia;
use Illuminate\Http\Request;


class GrupoColaboradorController extends Controller
{
    // Mostrar la lista de grupos de colaboradores
    public function index()
    {
        $grupos = GrupoColaborador::all();

        return Inertia::render('GestionGrupoColaboradores', [
            'grupos' => $grupos
        ]);
    }

    // Crear un nuevo grupo de colaboradores
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'nullable|string|max:100',
            'descripcion' => 'nullable|string',
            'temas_abordados' => 'nullable|string',
        ]);

        GrupoColaborador::create($request->all());

        return redirect()->route('grupos-colaboradores.index');
    }

    // Eliminar un grupo de colaboradores
    public function destroy($id)
    {
        $grupo = GrupoColaborador::findOrFail($id);
        $grupo->delete();

        return redirect()->route('grupos-colaboradores.index');
    }

   // Método para mostrar el formulario de edición
public function edit($id)
{
    $grupoColaborador = GrupoColaborador::findOrFail($id);

    return Inertia::render('EditarGrupoColaboradores', [
        'grupoColaborador' => $grupoColaborador, // Pasa cualquier dato necesario
    ]);
    
}

// Método para actualizar el grupo de colaboradores
public function update(Request $request, $id)
{
    // Validar los datos recibidos
    $request->validate([
        'nombre' => 'required|string|max:255',
        'tipo' => 'required|string|max:255',
        'descripcion' => 'nullable|string',
        'temas_abordados' => 'nullable|string',
    ]);

    // Buscar el grupo de colaboradores
    $grupoColaborador = GrupoColaborador::findOrFail($id);

    // Actualizar el grupo de colaboradores con los nuevos datos
    $grupoColaborador->update([
        'nombre' => $request->nombre,
        'tipo' => $request->tipo,
        'descripcion' => $request->descripcion,
        'temas_abordados' => $request->temas_abordados,
    ]);

    // Redirigir con mensaje flash
    return redirect()->route('grupos-colaboradores.index')->with('success', 'Grupo de colaboradores actualizado correctamente');
}

}
