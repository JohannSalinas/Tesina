<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\Rules;

class UserController extends Controller
{

    public function storeNewUser(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'user_type' => 'required|in:admin,profesor,coordinador',
            'genero' => 'required|in:masculino,femenino,otro',
            'apellidos' => 'required|string|max:255',
            'gradoAcademico' => 'required|in:licenciatura,maestria,doctorado',
            'fechaNacimiento' => 'required|date',
            'foto' => 'required|image|max:10240',
        ]);

        $fechaNacimiento = \Carbon\Carbon::parse($request->fechaNacimiento);
        if ($fechaNacimiento->diffInYears(\Carbon\Carbon::now()) < 18) {
            return redirect()->back()->withErrors(['fechaNacimiento' => 'Debes tener al menos 18 años.']);
        }

        // Handle the image upload
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('fotos', 'public');
        }

        $user = User::create([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => $request->user_type,
            'genero' => $request->genero,
            'gradoAcademico' => $request->gradoAcademico,
            'fechaNacimiento' => $request->fechaNacimiento,
            'foto' => $fotoPath,
        ]);

        return redirect(route('usuarios.index'));
    }
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
        'apellidos' => 'required|string|max:255',
        'genero' => 'required|in:masculino,femenino,otro',
        'gradoAcademico' => 'required|in:licenciatura,maestria,doctorado',
        'fechaNacimiento' => 'required|date',
        'foto' => 'nullable|image|max:10240'
    ]);

    $fechaNacimiento = \Carbon\Carbon::parse($request->fechaNacimiento);
        if ($fechaNacimiento->diffInYears(\Carbon\Carbon::now()) < 18) {
            return redirect()->back()->withErrors(['fechaNacimiento' => 'Debes tener al menos 18 años.']);
        }

    $user = User::findOrFail($id);

    // Si la contraseña fue proporcionada, la actualizamos
    if ($request->filled('password')) {
        $user->password = bcrypt($request->password);
    }

    // Manejo de archivo
    if ($request->hasFile('foto')) {
        $this->deleteFile($user->foto); // Asume que guardas la ruta en `foto`
        $user->foto = $request->file('foto')->store('fotos', 'public');
    }

    $user->update($request->only([
        'nombre',
        'apellidos',
        'email',
        'user_type',
        'genero',
        'gradoAcademico',
        'fechaNacimiento',
        'foto' => $user->foto
    ]));


    return redirect()->route('usuarios.index');
}

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

        } catch (\Exception $e) {

        }
    }


    private function deleteFile($filePath)
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }
    }
}
