<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecursosEducativosController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NoticiasController;

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
        Route::put('/{id}', [UserController::class, 'update'])->name('update');
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
});

require __DIR__.'/auth.php';
