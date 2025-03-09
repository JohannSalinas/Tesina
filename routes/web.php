<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\NotificationsController;
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
use App\Http\Controllers\BackupController;
use App\Http\Controllers\PreguntaForoController;
use App\Http\Controllers\RespuestaForoController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
/*
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
*/


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

    Route::post('guardar', [UserController::class, 'storeNewUser'])->name('storeNewUser');

    // Rutas para Recursos Educativos
    // Rutas protegidas para la gestión de Recursos Educativos
        Route::prefix('recursos')->name('recursos.')->group(function () {
            Route::get('/', [RecursosEducativosController::class, 'index'])->name('index');
            Route::post('/crear', [RecursosEducativosController::class, 'store'])->name('store');
            Route::delete('/{id}', [RecursosEducativosController::class, 'destroy'])->name('destroy');
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

Route::get('/backup-restore', [BackupController::class, 'index'])->name('backup-restore.index'); // Vista React
Route::post('/backup-restore/backup', [BackupController::class, 'backup'])->name('backup-restore.backup'); // Respaldo
Route::post('/backup-restore/restore', [BackupController::class, 'restore'])->name('backup-restore.restore'); // Restauración
Route::get('/backup-restore/download-latest', [BackupController::class, 'downloadLatestBackup'])->name('backup-restore.download-latest'); // Descargar respaldo

Route::get('/profesor/grupos', [GrupoColaboradorController::class, 'indexProfesor'])->name('grupos-colaboradores.profesor');

Route::get('/profesor/mis-recursos', [RecursosEducativosController::class, 'recursosProfesor'])->name('recursos.profesor');
Route::post('recursos/{recurso}/calificar', [RecursosEducativosController::class, 'calificar'])->name('recursos.calificar');
Route::get('/recursos/calificaciones-usuario', [RecursosEducativosController::class, 'calificacionesUsuario'])->name('recursos.calificacionesUsuario');

// Rutas para las preguntas del foro
Route::get('/preguntas', [PreguntaForoController::class, 'index'])->name('preguntas.index');
Route::post('/preguntas', [PreguntaForoController::class, 'store'])->name('preguntas.store');
Route::post('/respuestas', [RespuestaForoController::class, 'store'])->name('respuestas.store');

//Rutas para las notificaciones de unirse a un grupo
Route::get('/notificaciones', [NotificationsController::class, 'show'])->name('notifications.show');
Route::post('notificaciones/crear', [NotificationsController::class, 'store'])->name('notifications.store');
Route::put('notificaciones/{id}', [NotificationsController::class, 'update'])->name('notifications.update');

Route::get('/reportes', [ReporteController::class, 'index'])->name('reportes.index');
Route::get('/reportes/top-recursos', [ReporteController::class, 'topRecursos'])->name('reportes.top');
Route::get('/reportes/recursos-categoria', [ReporteController::class, 'recursosPorCategoria'])->name('reportes.categoria');
Route::get('/reportes/recursos-solicitudes', [ReporteController::class, 'recursosPorSolicitudes'])->name('reportes.solicitudes');
Route::get('/reportes/indicadores', [ReporteController::class, 'indicadoresEncuesta'])->name('reportes.indicadores');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/noticias/profesor', [NoticiasController::class, 'obtenerNoticias'])->name('noticias.profesor');

Route::get('/encuestas/profesor', [EncuestaController::class, 'obtenerEncuestas'])->name('encuestas.profesor');
Route::post('/encuestas/{id}/responder', [EncuestaController::class, 'responder']);

});


require __DIR__.'/auth.php';
