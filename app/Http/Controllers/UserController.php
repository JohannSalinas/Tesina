<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    public function edit($id)
    {
        $user = User::findOrFail($id);
        return Inertia::render('EditarUsuario', [
            'user' => $user
        ]);
    }

    public function update(Request $request, $id)
{
    $request->validate([
        'nombre' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email,' . $id,
        'user_type' => 'required|string',
        'password' => 'nullable|string|min:8|confirmed',  // Validación de la contraseña
        'apellidos' => 'nullable|string|max:255',
        'genero' => 'required|in:masculino,femenino,otro',
        'gradoAcademico' => 'required|in:licenciatura,maestria,doctorado',
        'fechaNacimiento' => 'nullable|date',
        'foto' => 'nullable|image|max:10240'
    ]);

    $user = User::findOrFail($id);

    // Si la contraseña fue proporcionada, la actualizamos
    if ($request->filled('password')) {
        $user->password = bcrypt($request->password);
    }

    // Manejo de archivo
    if ($request->hasFile('foto')) {
        $this->deleteFile($user->foto); // Asume que guardas la ruta en `foto`
        $user->foto = $request->file('foto')->store('recursos', 'public');
    }

    $user->update($request->only([
        'nombre',
        'apellidos',
        'email',
        'user_type',
        'genero',
        'gradoAcademico',
        'fechaNacimiento',
        'foto'
    ]));

    return redirect()->route('usuarios.index');
}

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return response()->json(['message' => 'Usuario eliminado correctamente.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar el usuario.'], 500);
        }
    }


    private function deleteFile($filePath)
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }
    }
}
