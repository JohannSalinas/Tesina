<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class BackupController extends Controller
{
    public function index()
    {
        return Inertia::render('BackupRestore');
    }

    // ✅ Acción para realizar el respaldo de la base de datos
    public function backup()
    {
        try {
           if (!Storage::exists('public/backups')) {
               Storage::makeDirectory('backups');
           }

            $fileName = 'backup_' . now()->format('Ymd_His') . '.sql';
            $backupPath = storage_path("app/public/backups/{$fileName}");

            // Configuración de la base de datos
            $dbHost = config('database.connections.mysql.host', '127.0.0.1');
            $dbUser = config('database.connections.mysql.username');
            $dbPass = config('database.connections.mysql.password');
            $dbName = config('database.connections.mysql.database');

            // Construir el comando como string en lugar de array
            $command = sprintf(
                '"%s" --host=%s --user=%s --password=%s %s > "%s"',
                'C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysqldump.exe',
                escapeshellarg($dbHost),
                escapeshellarg($dbUser),
                escapeshellarg($dbPass),
                escapeshellarg($dbName),
                $backupPath
            );

            // Ejecutar el comando usando exec
            $output = null;
            $resultCode = null;
            exec($command, $output, $resultCode);

            // Verificar si el archivo se creó y tiene contenido
            if ($resultCode !== 0 || !file_exists($backupPath) || filesize($backupPath) === 0) {
                Log::error('Error en backup: Código ' . $resultCode . ', Output: ' . implode("\n", $output));
                throw new \Exception('El archivo de respaldo está vacío o no se pudo crear.');
            }

            // Log para debugging
            Log::info('Backup creado: ' . $backupPath . ' - Tamaño: ' . filesize($backupPath) . ' bytes');

            return back()->with([
                'success' => true,
                'message' => 'Respaldo realizado exitosamente.'
            ]);

        } catch (\Exception $e) {
            Log::error('Error en backup: ' . $e->getMessage());

            return back()->with([
                'error' => 'Error al realizar el respaldo: ' . $e->getMessage()
            ]);
        }
    }

    public function restore(Request $request)
    {
        try {
            $request->validate([
                'backup_file' => 'required|file|mimes:sql',
            ]);

            // Guardar el archivo temporalmente
            $uploadedFile = $request->file('backup_file');
            $tempPath = storage_path('app/temp');

            if (!file_exists($tempPath)) {
                mkdir($tempPath, 0755, true);
            }

            $filePath = $tempPath . '/' . $uploadedFile->getClientOriginalName();
            move_uploaded_file($uploadedFile->getRealPath(), $filePath);

            // Configuración de la base de datos
            $dbHost = config('database.connections.mysql.host', '127.0.0.1');
            $dbUser = config('database.connections.mysql.username');
            $dbPass = config('database.connections.mysql.password');
            $dbName = config('database.connections.mysql.database');

            // Primero intentamos con mysql.exe
            $command = sprintf(
                '"C:\\xampp\\mysql\\bin\\mysql.exe" -h%s -u%s -p%s %s < "%s"',
                $dbHost,
                $dbUser,
                $dbPass,
                $dbName,
                $filePath
            );

            // Log del comando para debugging (omitiendo la contraseña)
            Log::info('Ejecutando comando de restauración (contraseña omitida)');

            // Ejecutar el comando
            $output = [];
            $resultCode = 0;
            exec($command . " 2>&1", $output, $resultCode);

            // Log de la salida para debugging
            Log::info('Código de resultado: ' . $resultCode);
            Log::info('Salida del comando: ' . implode("\n", $output));

            // Limpiar archivo temporal
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            if ($resultCode !== 0) {
                throw new \Exception('Error en la restauración: ' . implode("\n", $output));
            }

            return back()->with([
                'success' => true,
                'message' => 'Base de datos restaurada exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error en restore: ' . $e->getMessage());

            // Limpiar archivo temporal si existe
            if (isset($filePath) && file_exists($filePath)) {
                unlink($filePath);
            }

            return back()->with([
                'error' => 'Error al restaurar la base de datos: ' . $e->getMessage()
            ]);
        }
    }

}
