// resources/js/Pages/GestionEncuestas.jsx

import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function GestionEncuestas({ encuestas }) {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Gestión de Encuestas
                </h1>

                {/* Botón para crear una nueva encuesta */}
                <div className="mb-4">
                    <Link
                        href={route('encuestas.create')}
                        className="inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                    >
                        Crear Nueva Encuesta
                    </Link>
                </div>

                {/* Tabla para mostrar las encuestas */}
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Título
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Descripción
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {encuestas.map((encuesta) => (
                                <tr key={encuesta.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {encuesta.titulo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {encuesta.descripcion || 'No disponible'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            href={route('encuestas.edit', encuesta.id)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Editar
                                        </Link>
                                        <span className="mx-2 text-gray-400">|</span>
                                        <Link
                                            href={route('encuestas.destroy', encuesta.id)}
                                            method="delete"
                                            as="button"
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
