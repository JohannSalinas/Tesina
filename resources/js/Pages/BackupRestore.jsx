import React, { useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';


const BackupRestore = () => {
    const [backupStatus, setBackupStatus] = useState(null);
    const [isRestoring, setIsRestoring] = useState(false);

    // Para el respaldo
    const { post: backupPost, processing: isBackingUp } = useForm();

    // Para la restauración
    const { post: restorePost, processing: isRestoringData } = useForm();

    const handleBackup = () => {
        setBackupStatus(null);
        backupPost(route('backup-restore.backup'), {
            onSuccess: () => setBackupStatus({ type: 'success', message: 'Respaldo realizado exitosamente.' }),
            onError: (errors) => {
                console.error("Error en el respaldo:", errors);
                setBackupStatus({ type: 'error', message: errors.error || 'Hubo un error al realizar el respaldo.' });
            }
        });
    };

    const handleRestore = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) {
            setBackupStatus({ type: 'error', message: 'Por favor, seleccione un archivo de respaldo.' });
            return;
        }

        setIsRestoring(true);
        const formData = new FormData();
        formData.append('backup_file', file);

        restorePost(route('backup-restore.restore'), formData, {
            onSuccess: () => {
                setIsRestoring(false);
                setBackupStatus({ type: 'success', message: 'Restauración completada con éxito.' });
            },
            onError: () => {
                setIsRestoring(false);
                setBackupStatus({ type: 'error', message: 'Hubo un error durante la restauración.' });
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            {/* Título y navegación */}
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-gray-700 mb-4 text-center">
                    Respaldo y Restauración de Base de Datos
                </h1>

                {/* Mensaje de estado */}
                {backupStatus && (
                    <div className={`p-3 text-white rounded-md mb-4 text-center ${backupStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {backupStatus.message}
                    </div>
                )}

                {/* Sección de Respaldo */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Respaldo de Base de Datos</h2>
                    <button
                        onClick={handleBackup}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                        disabled={isBackingUp}
                    >
                        {isBackingUp ? 'Realizando Respaldo...' : 'Realizar Respaldo'}
                    </button>
                </div>

                {/* Sección de Restauración */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Restauración de Base de Datos</h2>
                    <input
                        type="file"
                        onChange={handleRestore}
                        className="block w-full text-gray-700 border border-gray-300 rounded-md p-2 mb-3"
                        accept=".sql,.gz"
                        disabled={isRestoringData}
                    />
                    <button
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                        disabled={isRestoringData}
                    >
                        {isRestoringData ? 'Restaurando...' : 'Restaurar Respaldo'}
                    </button>
                </div>
            </div>

            {/* Enlace de regreso */}
            <div className="text-center mt-6">
                <Link href={route('dashboard')} className="text-blue-600 hover:underline">
                    &larr; Volver al Dashboard
                </Link>
            </div>
        </div>
    );
};

export default BackupRestore;