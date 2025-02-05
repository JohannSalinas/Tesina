<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Inertia\Inertia; // Agrega esta línea para importar Inertia

class BackupController extends Controller
{
    public function index()
    {
        return Inertia::render('BackupRestore'); // Asegúrate de que esté el archivo BackupRestore.jsx en Pages
    }

    // Acción para realizar el respaldo
    public function backup()
    {
        $filename = 'backup_' . now()->format('Ymd_His') . '.sql';

        // Comando para hacer el respaldo
        $command = 'mysqldump --opt --user=' . env('DB_USERNAME') . ' --password=' . env('DB_PASSWORD') . ' --host=' . env('DB_HOST') . ' ' . env('DB_DATABASE') . ' > ' . storage_path('app/public/' . $filename);
        exec($command);

        return response()->json([
            'message' => 'Respaldo realizado con éxito',
            'file' => $filename
        ]);
    }

    // Acción para restaurar la base de datos
    public function restore(Request $request)
    {
        $request->validate([
            'backup_file' => 'required|file|mimes:sql,gz|max:10240',
        ]);

        $path = $request->file('backup_file')->storeAs('backups', $request->file('backup_file')->getClientOriginalName(), 'public');

        $command = 'mysql --user=' . env('DB_USERNAME') . ' --password=' . env('DB_PASSWORD') . ' --host=' . env('DB_HOST') . ' ' . env('DB_DATABASE') . ' < ' . storage_path('app/public/' . $path);
        exec($command);

        return response()->json([
            'message' => 'Restauración realizada con éxito',
        ]);
    }
}
