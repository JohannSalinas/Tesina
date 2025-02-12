import { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { route } from "ziggy-js";

export default function Notificaciones() {
    const { notificaciones } = usePage().props;
    const auth = usePage().props.auth.user;
    const [filteredNotificaciones, setFilteredNotificaciones] = useState([]);

    useEffect(() => {
        if (auth.id) {
            // Primero filtramos por visible = 1
            const visibleNotificaciones = notificaciones.filter(notif => notif.visible === 1);

            // Luego aplicamos el filtro según el rol del usuario
            if (auth.id === notificaciones[0]?.id_usuario_creador_grupo) {
                // Si el usuario es el creador del grupo, muestra las pendientes
                setFilteredNotificaciones(visibleNotificaciones.filter(notif => notif.estatus === 'pendiente'));
            } else {
                // Si el usuario es el solicitante, muestra las aceptadas o rechazadas
                setFilteredNotificaciones(visibleNotificaciones.filter(notif => notif.estatus !== 'pendiente'));
            }
        }
    }, [auth, notificaciones]);

    const handleUpdateStatus = (notificacionId, newStatus, isVisible) => {
        router.put(route('notifications.update', notificacionId), {
            estatus: newStatus,
            visible: isVisible,
        }, {
            onSuccess: () => {
                setFilteredNotificaciones((prev) =>
                    prev.map(notif =>
                        notif.id === notificacionId ? { ...notif, estatus: newStatus, visible: isVisible } : notif
                    ).filter(notif => notif.visible === 1) // Filtrar después de actualizar
                );
            },
            onError: (error) => {
                console.error('Error al actualizar la notificación:', error);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Notificaciones</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotificaciones.length > 0 ? (
                        filteredNotificaciones.map((notificacion) => (
                            <div key={notificacion.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{`Grupo: ${notificacion.grupo.nombre}`}</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    {`Solicitante: ${notificacion.usuario_solicitante.nombre}`}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300 mt-2">{`Estatus: ${notificacion.estatus}`}</p>

                                {notificacion.estatus === 'pendiente' ? (
                                    <div className="mt-4">
                                        <button
                                            className="bg-green-500 text-white p-2 rounded-md"
                                            onClick={() => handleUpdateStatus(notificacion.id, 'aceptado', true)}
                                        >
                                            Aceptar
                                        </button>
                                        <button
                                            className="bg-red-500 text-white p-2 rounded-md ml-2"
                                            onClick={() => handleUpdateStatus(notificacion.id, 'rechazado', true)}
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <button
                                            className="bg-gray-500 text-white p-2 rounded-md"
                                            onClick={() => handleUpdateStatus(notificacion.id, notificacion.estatus, false)}
                                        >
                                            Deshabilitar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">No tienes notificaciones.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
