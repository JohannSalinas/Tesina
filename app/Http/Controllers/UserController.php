<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email,' . $id,
        'user_type' => 'required|string',
        'password' => 'nullable|string|min:8|confirmed',  // Validación de la contraseña
    ]);

    $user = User::findOrFail($id);

    // Si la contraseña fue proporcionada, la actualizamos
    if ($request->filled('password')) {
        $user->password = bcrypt($request->password);
    }

    $user->update($request->only('name', 'email', 'user_type'));

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
}