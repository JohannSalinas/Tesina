import React, { useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { route } from 'ziggy-js';
import axios from 'axios';
import { Link } from '@inertiajs/inertia-react';
import {router} from "@inertiajs/react";


const BackupRestore = () => {
    const [backupStatus, setBackupStatus] = useState(null);
    const [isRestoring, setIsRestoring] = useState(false);

    const { post: backupPost, processing: isBackingUp } = useForm({});
    const { post: restorePost, processing: isRestoringData } = useForm({});


    const handleBackup = async () => {
        console.log('Entrando en handleBackup');
        try {
            const response = await axios.post(route('backup-restore.backup'));
            console.log('Respuesta exitosa:', response);
            setBackupStatus({ type: 'success', message: 'Respaldo realizado exitosamente.' });

            // Descargar el archivo recién creado
            const fileName = response.data.fileName;
            const downloadUrl = route('backup-restore.download-latest');

            console.log('Descargando archivo:', fileName);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setBackupStatus({ type: 'error', message: 'Hubo un error durante el respaldo.' });
        }
    };

    const RestoreForm = () => {
        const [selectedFile, setSelectedFile] = useState(null);

        const handleFileChange = (e) => {
            setSelectedFile(e.target.files[0]);
        };

        const handleRestore = (e) => {
            e.preventDefault();

            if (!selectedFile) {
                setBackupStatus({ type: 'error', message: 'Por favor seleccione un archivo de respaldo.' });
                return;
            }

            // Crear un nuevo FormData
            const formData = new FormData();
            formData.append('backup_file', selectedFile);

            // Hacer la petición usando el router de Inertia
            router.post(route('backup-restore.restore'), formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setBackupStatus({ type: 'success', message: 'Base de datos restaurada exitosamente.' });
                    setSelectedFile(null);
                    // Limpiar el input file
                    e.target.reset();
                },
                onError: (error) => {
                    setBackupStatus({
                        type: 'error',
                        message: error.message || 'Error al restaurar la base de datos.'
                    });
                }
            });
        };

        return (
            <form onSubmit={handleRestore} encType="multipart/form-data">
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        name="backup_file"
                        onChange={handleFileChange}
                        accept=".sql"
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                             file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700
                             hover:file:bg-violet-100"
                    />
                    <button
                        type="submit"
                        disabled={!selectedFile || isRestoringData}
                        className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRestoringData ? 'Restaurando...' : 'Restaurar Base de Datos'}
                    </button>
                </div>
                {/* Opcional: Mostrar nombre del archivo seleccionado */}
                {selectedFile && (
                    <div className="mt-2 text-sm text-gray-600">
                        Archivo seleccionado: {selectedFile.name}
                    </div>
                )}
            </form>
        );
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
                    <RestoreForm />
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
