import React, { useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';

const BackupRestore = () => {
    const [isRestoring, setIsRestoring] = useState(false);
    const [backupStatus, setBackupStatus] = useState(null);  // Para mostrar el estado del respaldo

    // Para el respaldo
    const { post: backupPost, processing: isBackingUp } = useForm();

    // Para la restauración
    const { post: restorePost, processing: isRestoringData } = useForm();

    const handleBackup = () => {
        setBackupStatus(null);  // Resetear cualquier estado previo
        backupPost(route('backup-restore.backup'), {
            onSuccess: () => {
                setBackupStatus('Respaldo realizado exitosamente.');
            },
            onError: () => {
                setBackupStatus('Hubo un error al realizar el respaldo.');
            }
        });
    };

    const handleRestore = (e) => {
        e.preventDefault();

        const file = e.target.files[0];
        if (!file) {
            alert("Por favor, seleccione un archivo de respaldo.");
            return;
        }

        setIsRestoring(true); // Inicia el estado de restauración

        const formData = new FormData();
        formData.append('backup_file', file);

        restorePost(route('backup-restore.restore'), formData, {
            onSuccess: () => {
                setIsRestoring(false);
                alert('Restauración completada con éxito.');
            },
            onError: () => {
                setIsRestoring(false);
                alert('Hubo un error durante la restauración.');
            }
        });
    };

    return (
        <div className="container">
            <h1 className="my-4">Respaldo y Restauración de Base de Datos</h1>

            <div className="mt-4">
                <button
                    onClick={handleBackup}
                    className="btn btn-primary"
                    disabled={isBackingUp}
                >
                    {isBackingUp ? 'Realizando Respaldo...' : 'Realizar Respaldo'}
                </button>
                {backupStatus && (
                    <div className="mt-2 text-success">
                        {backupStatus}
                    </div>
                )}
            </div>

            <div className="mt-4">
                <label htmlFor="backup-file" className="form-label">
                    Seleccionar archivo para restaurar
                </label>
                <input
                    type="file"
                    id="backup-file"
                    onChange={handleRestore}
                    className="form-control"
                    accept=".sql,.gz"
                    disabled={isRestoringData}
                />
                <button
                    onClick={handleRestore}
                    disabled={isRestoringData}
                    className="btn btn-secondary mt-2"
                >
                    {isRestoringData ? 'Restaurando...' : 'Restaurar Respaldo'}
                </button>
            </div>
        </div>
    );
};

export default BackupRestore;
