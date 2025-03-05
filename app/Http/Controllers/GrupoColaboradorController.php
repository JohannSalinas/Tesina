<?php

namespace App\Http\Controllers;

use App\Models\GrupoColaborador;
use App\Models\GrupoUsuario;
use Inertia\Inertia;
use App\Models\User;
use App\Notifications\SolicitudUnirseGrupo;
use Illuminate\Support\Facades\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


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



        // Obtener el usuario autenticado
        $user = Auth::user();

         // Crear el grupo y asignar el usuario como creador
         $grupo = GrupoColaborador::create([
            'nombre' => $request->nombre,
            'tipo' => $request->tipo,
            'descripcion' => $request->descripcion,
            'temas_abordados' => $request->temas_abordados,
            'creador_id' => $user->id, // ✅ Se asigna el usuario que crea el grupo
            'numero_inscritos' => 1,   // ✅ Se inicia con 1 inscrito (el creador)
        ]);

        // Agregar al usuario como miembro del grupo
        GrupoUsuario::create([
            'grupo_id' => $grupo->id,
            'usuario_id' => $user->id,
        ]);

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


public function indexProfesor()
{
    // Obtener el usuario autenticado
    $usuario = Auth::user();

    // Obtener los IDs de los grupos a los que el usuario ya está unido
    $gruposUnidos = GrupoUsuario::where('usuario_id', $usuario->id)->pluck('grupo_id')->toArray();

    // Filtrar los grupos para excluir aquellos a los que el usuario ya está unido
    $grupos = GrupoColaborador::whereNotIn('id', $gruposUnidos)->get();

    return Inertia::render('Profesor/ListaGrupos', [
        'grupos' => $grupos
    ]);
}
/*
public function solicitarUnirse($grupoId)
{
    // Obtener el grupo y el primer usuario
    $grupo = GrupoColaborador::findOrFail($grupoId);
    $primerUsuario = GrupoUsuario::where('grupo_id', $grupo->id)->first()->usuario;

    // Obtener el usuario autenticado (el que solicita unirse)
    $usuarioSolicitante = auth()->user();

    // Enviar la notificación al primer usuario del grupo
    Notification::send($primerUsuario, new SolicitudUnirseGrupo($grupo, $usuarioSolicitante));

    return back()->with('success', 'Solicitud enviada correctamente.');
}*/


}
