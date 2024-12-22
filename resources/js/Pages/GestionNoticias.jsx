import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function GestionNoticias() {
    const { noticias } = usePage().props;

    // Estado para el formulario de creación de noticia
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        lugar: '',
        fecha_evento: '',
        imagen: null,
    });

    // Estado para el mensaje de error
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación para la fecha: no permitir fecha anterior a la actual
        const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
        if (formData.fecha_evento < today) {
            setError('La fecha del evento no puede ser anterior a la fecha actual.');
            return; // No enviar el formulario
        }

        setError(''); // Limpiar error si la fecha es válida

        const form = new FormData();
        form.append('titulo', formData.titulo);
        form.append('descripcion', formData.descripcion);
        form.append('lugar', formData.lugar);
        form.append('fecha_evento', formData.fecha_evento);
        form.append('imagen', formData.imagen);

        router.post('/noticias', form, {
            onSuccess: () => {
                alert('Noticia creada correctamente.');
                setFormData({ titulo: '', descripcion: '', lugar: '', fecha_evento: '', imagen: null }); // Limpiar formulario
            },
            onError: (error) => {
                alert('Ocurrió un error al crear la noticia.');
                console.log(error);
            },
        });
    };

    const handleDelete = (noticiaId) => {
        if (confirm(`¿Estás seguro de que deseas eliminar esta noticia con ID: ${noticiaId}?`)) {
            router.delete(`/noticias/${noticiaId}`, {
                onSuccess: () => alert('Noticia eliminada correctamente.'),
                onError: () => alert('Ocurrió un error al intentar eliminar la noticia.'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Administrar Noticias
                </h2>
            }
        >
            <Head title="Administrar Noticias" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Formulario para crear una nueva noticia */}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Crear una nueva noticia
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
                                    <label htmlFor="lugar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Lugar
                                    </label>
                                    <input
                                        type="text"
                                        id="lugar"
                                        name="lugar"
                                        value={formData.lugar}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="fecha_evento" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Fecha del Evento
                                    </label>
                                    <input
                                        type="date"
                                        id="fecha_evento"
                                        name="fecha_evento"
                                        value={formData.fecha_evento}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    />
                                    {/* Mostrar mensaje de error si la fecha es incorrecta */}
                                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                                </div>
                                <div>
                                    <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Imagen
                                    </label>
                                    <input
                                        type="file"
                                        id="imagen"
                                        name="imagen"
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                >
                                    Crear Noticia
                                </button>
                            </form>

                            {/* Tabla de noticias existentes */}
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
                                            Lugar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Fecha Evento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {noticias.map((noticia) => (
                                        <tr key={noticia.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{noticia.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{noticia.titulo}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{noticia.lugar}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{noticia.fecha_evento}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                <button
                                                    className="px-3 py-1 mr-2 text-white bg-red-500 rounded hover:bg-red-600"
                                                    onClick={() => handleDelete(noticia.id)}
                                                >
                                                    Eliminar
                                                </button>
                                                <Link
                                                    href={`/noticias/${noticia.id}/editar`}
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
