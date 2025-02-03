<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecursosEducativosController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NoticiasController;
use App\Http\Controllers\EncuestaController;
use App\Http\Controllers\GrupoColaboradorController;
use App\Http\Controllers\GrupoUsuarioController;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Rutas de perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rutas para Admin Usuarios
    Route::prefix('usuarios')->name('usuarios.')->group(function () {
        Route::get('/', function () {
            $users = User::all(); // Aquí puedes aplicar paginación o filtros si es necesario
            return Inertia::render('Adminusuarios', ['users' => $users]);
        })->name('index');
        Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy');
        Route::get('/{id}/editar', [UserController::class, 'edit'])->name('edit');
        Route::match(['post', 'put'], '/{id}', [UserController::class, 'update'])->name('update');
    });

    // Rutas para Recursos Educativos
    // Rutas protegidas para la gestión de Recursos Educativos
Route::prefix('recursos')->name('recursos.')->group(function () {
    // Listar todos los recursos educativos
    Route::get('/', function () {
        $recursos = \App\Models\RecursoEducativo::all(); // Puedes agregar filtros o paginación aquí
        return Inertia::render('RecursosEducativos', ['recursos' => $recursos]);
    })->name('index');
    Route::delete('/{id}', [RecursosEducativosController::class, 'destroy'])->name('destroy');
    Route::get('/crear', [RecursosEducativosController::class, 'create'])->name('create');
    Route::post('/', [RecursosEducativosController::class, 'store'])->name('store');
    Route::get('/{id}/editar', [RecursosEducativosController::class, 'edit'])->name('edit');
    Route::put('/{id}', [RecursosEducativosController::class, 'update'])->name('update');
});

// Rutas para Gestión de Noticias
Route::prefix('noticias')->name('noticias.')->group(function () {
    // Renderiza directamente la vista desde `Pages/GestionNoticias.jsx`
    Route::get('/', function () {
        $noticias = \App\Models\Noticia::all(); // Puedes agregar filtros o paginación aquí
        return Inertia::render('GestionNoticias',['noticias' => $noticias]);
    })->name('index');
    Route::delete('/{id}', [NoticiasController::class, 'destroy'])->name('destroy');
    Route::get('/crear', [NoticiasController::class, 'create'])->name('create');
    Route::post('/', [NoticiasController::class, 'store'])->name('store');
    Route::get('/{id}/editar', [NoticiasController::class, 'edit'])->name('edit');
    Route::put('/{id}', [NoticiasController::class, 'update'])->name('update');
});



// Rutas para Encuestas
Route::prefix('encuestas')->name('encuestas.')->group(function () {
    Route::get('/', [EncuestaController::class, 'index'])->name('index');
    Route::get('/crear', [EncuestaController::class, 'create'])->name('create');
    Route::post('/', [EncuestaController::class, 'store'])->name('store');
    Route::get('/{id}/editar', [EncuestaController::class, 'edit'])->name('edit');
    Route::put('/{id}', [EncuestaController::class, 'update'])->name('update');
    Route::delete('/{id}', [EncuestaController::class, 'destroy'])->name('destroy');
});


Route::prefix('grupos-colaboradores')->name('grupos-colaboradores.')->group(function () {
    Route::get('/', [GrupoColaboradorController::class, 'index'])->name('index'); // Listado de grupos de colaboradores
    Route::get('/crear', [GrupoColaboradorController::class, 'create'])->name('create'); // Formulario para crear un grupo de colaboradores
    Route::post('/', [GrupoColaboradorController::class, 'store'])->name('store'); // Almacenar grupo de colaboradores
    Route::get('/{id}/editar', [GrupoColaboradorController::class, 'edit'])->name('edit'); // Formulario para editar un grupo de colaboradores
    Route::put('/{id}', [GrupoColaboradorController::class, 'update'])->name('update'); // Actualizar grupo de colaboradores
    Route::delete('/{id}', [GrupoColaboradorController::class, 'destroy'])->name('destroy'); // Eliminar grupo de colaboradores
});

Route::get('/grupo-usuarios', [GrupoUsuarioController::class, 'index'])->name('grupo-usuarios.index');


Route::get('/profesor/grupos', [GrupoColaboradorController::class, 'indexProfesor'])->name('grupos-colaboradores.profesor');

});


require __DIR__.'/auth.php';
