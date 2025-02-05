// pages/Profesor/ListaRecursos.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';

export default function ListaRecursos({ recursos }) {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Recursos Educativos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recursos.length > 0 ? (
                    recursos.map((recurso) => (
                        <div key={recurso.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{recurso.titulo}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">{recurso.descripcion}</p>
                            <a href={recurso.url} className="text-blue-600 dark:text-blue-400 mt-2">Ver Recurso</a>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 dark:text-gray-400">No hay recursos disponibles para tu grupo.</p>
                )}
            </div>
        </div>
    );
}
