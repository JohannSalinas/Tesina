import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function GestionEncuestas() {
    const { encuestas } = usePage().props;

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        preguntas: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append('titulo', formData.titulo);
        form.append('descripcion', formData.descripcion);
        form.append('preguntas', formData.preguntas);

        router.post('/encuestas', form, {
            onSuccess: () => {
                alert('Encuesta creada correctamente.');
                setFormData({ titulo: '', descripcion: '', preguntas: '' });
            },
            onError: (error) => {
                alert('Ocurrió un error al crear la encuesta.');
                console.error(error);
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
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Administrar Encuestas</h2>}
        >
            <Head title="Administrar Encuestas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-semibold mb-4">Crear una nueva encuesta</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="titulo" className="block text-sm font-medium">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        value={formData.titulo}
                                        onChange={handleInputChange}
                                        className="w-full p-2 mt-1 border rounded"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="descripcion" className="block text-sm font-medium">
                                        Descripción
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                        className="w-full p-2 mt-1 border rounded"
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="preguntas" className="block text-sm font-medium">
                                        Preguntas
                                    </label>
                                    <textarea
                                        id="preguntas"
                                        name="preguntas"
                                        value={formData.preguntas}
                                        onChange={handleInputChange}
                                        className="w-full p-2 mt-1 border rounded"
                                    ></textarea>
                                </div>
                                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" type="submit">
                                    Crear Encuesta
                                </button>
                            </form>

                            <h3 className="text-lg font-semibold mt-8">Encuestas Existentes</h3>
                            <table className="w-full mt-4">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">ID</th>
                                        <th className="border px-4 py-2">Título</th>
                                        <th className="border px-4 py-2">Descripción</th>
                                        <th className="border px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {encuestas.map((encuesta) => (
                                        <tr key={encuesta.id}>
                                            <td className="border px-4 py-2">{encuesta.id}</td>
                                            <td className="border px-4 py-2">{encuesta.titulo}</td>
                                            <td className="border px-4 py-2">{encuesta.descripcion}</td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 mr-2"
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
