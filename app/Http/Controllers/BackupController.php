<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
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
                'C:\\xampp\\mysql\\bin\\mysqldump.exe',
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
            if (!$request->hasFile('backup_file')) {
                throw new \Exception('No se ha seleccionado ningún archivo de respaldo.');
            }

            $file = $request->file('backup_file');

            // Validar que sea un archivo SQL
            if ($file->getClientOriginalExtension() !== 'sql') {
                throw new \Exception('El archivo debe ser de tipo SQL.');
            }

            // Guardar el archivo temporalmente
            $tempPath = storage_path('app/temp/') . $file->getClientOriginalName();
            if (!Storage::exists('temp')) {
                Storage::makeDirectory('temp');
            }

            $file->move(storage_path('app/temp/'), $file->getClientOriginalName());

            // Configuración de la base de datos
            $dbHost = config('database.connections.mysql.host', '127.0.0.1');
            $dbUser = config('database.connections.mysql.username');
            $dbPass = config('database.connections.mysql.password');
            $dbName = config('database.connections.mysql.database');

            // Construir el comando de restauración
            $command = sprintf(
                '"%s" --host=%s --user=%s --password=%s %s < "%s"',
                'C:\\xampp\\mysql\\bin\\mysql.exe',
                escapeshellarg($dbHost),
                escapeshellarg($dbUser),
                escapeshellarg($dbPass),
                escapeshellarg($dbName),
                $tempPath
            );

            // Ejecutar el comando
            $output = null;
            $resultCode = null;
            exec($command, $output, $resultCode);

            // Eliminar el archivo temporal
            unlink($tempPath);

            if ($resultCode !== 0) {
                Log::error('Error en restauración: Código ' . $resultCode . ', Output: ' . implode("\n", $output));
                throw new \Exception('Error al restaurar la base de datos.');
            }

            Log::info('Restauración completada exitosamente');

            return response()->json([
                'success' => true,
                'message' => 'Base de datos restaurada exitosamente.'
            ]);

        } catch (\Exception $e) {
            Log::error('Error en restauración: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al restaurar la base de datos: ' . $e->getMessage()
            ], 500);
        }
    }
}
