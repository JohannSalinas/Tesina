import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function GestionEncuestas() {
    const { encuestas } = usePage().props;

    // Estado para el formulario de creación de encuesta
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        preguntas: '',
    });

    // Estado para el mensaje de error
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setError(''); // Limpiar el error si existe

        const form = new FormData();
        form.append('titulo', formData.titulo);
        form.append('descripcion', formData.descripcion);
        form.append('preguntas', formData.preguntas);
        form.append('user_id', 1); // Asumiendo que el usuario con ID 1 es el administrador

        router.post('/encuestas', form, {
            onSuccess: () => {
                alert('Encuesta creada correctamente.');
                setFormData({ titulo: '', descripcion: '', preguntas: '' }); // Limpiar formulario
            },
            onError: (error) => {
                alert('Ocurrió un error al crear la encuesta.');
                console.log(error);
            },
        });
    };

    const handleDelete = (encuestaId) => {
        if (confirm(`¿Estás seguro de que deseas eliminar esta encuesta con ID: ${encuestaId}?`)) {
            router.delete(`/encuestas/${encuestaId}`, {
                onSuccess: () => alert('Encuesta eliminada correctamente.'),
                onError: () => alert('Ocurrió un error al intentar eliminar la encuesta.'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Administrar Encuestas
                </h2>
            }
        >
            <Head title="Administrar Encuestas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Formulario para crear una nueva encuesta */}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Crear una nueva encuesta
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        value={formData.titulo}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Descripción
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="preguntas" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Preguntas
                                    </label>
                                    <textarea
                                        id="preguntas"
                                        name="preguntas"
                                        value={formData.preguntas}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                >
                                    Crear Encuesta
                                </button>
                            </form>

                            {/* Tabla de encuestas existentes */}
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-8">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Título
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Descripción
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {encuestas.map((encuesta) => (
                                        <tr key={encuesta.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{encuesta.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{encuesta.titulo}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{encuesta.descripcion}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                <button
                                                    className="px-3 py-1 mr-2 text-white bg-red-500 rounded hover:bg-red-600"
                                                    onClick={() => handleDelete(encuesta.id)}
                                                >
                                                    Eliminar
                                                </button>
                                                <Link
                                                    href={`/encuestas/${encuesta.id}/editar`}
                                                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                                >
                                                    Modificar
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
