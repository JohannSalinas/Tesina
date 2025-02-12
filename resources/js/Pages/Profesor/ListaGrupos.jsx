import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { route} from "ziggy-js";

export default function ListaGrupos({ grupos }) {
    const user = usePage().props.auth.user;

    const handleUnirse = (grupoId, creadorId) => {
        // Realiza la solicitud POST a la ruta store de NotificationsController
        router.post(route('notifications.store'), {
            grupo_id: grupoId,
            creador_id: creadorId,
            usuario_id: user.id
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Grupos de Colaboradores</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grupos.length > 0 ? (
                        grupos.map((grupo) => (
                            <div key={grupo.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{grupo.nombre}</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">{grupo.tipo}</p>
                                <p className="text-gray-700 dark:text-gray-300 mt-2">{grupo.descripcion}</p>
                                <p className="text-gray-700 dark:text-gray-300 mt-2"><strong>Temas:</strong> {grupo.temas_abordados}</p>
                                <div className="mt-4">
                                    {/* Botón para que el usuario se una al grupo */}
                                    <button
                                        className="bg-blue-500 text-white p-2 rounded-md"
                                        onClick={() => handleUnirse(grupo.id, grupo.creador_id)}
                                    >
                                        Unirse
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">No hay grupos disponibles.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
