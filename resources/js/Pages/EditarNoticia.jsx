import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function EditarNoticias({ noticia }) {
    const { data, setData, put, errors } = useForm({
        titulo: noticia.titulo,
        descripcion: noticia.descripcion,
        lugar: noticia.lugar,
        fecha_evento: noticia.fecha_evento,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/noticias/${noticia.id}`, {
            onSuccess: () => alert('Noticia actualizada correctamente.'),
            onError: (err) => console.log('Errores:', err),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Noticia</h2>}
        >
            <Head title="Editar Noticia" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        value={data.titulo}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    />
                                    {errors.titulo && <p className="text-red-500 text-sm mt-2">{errors.titulo}</p>}
                                </div>
                                <div>
                                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Descripción
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={data.descripcion}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    ></textarea>
                                    {errors.descripcion && <p className="text-red-500 text-sm mt-2">{errors.descripcion}</p>}
                                </div>
                                <div>
                                    <label htmlFor="lugar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Lugar
                                    </label>
                                    <input
                                        type="text"
                                        id="lugar"
                                        name="lugar"
                                        value={data.lugar}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    />
                                    {errors.lugar && <p className="text-red-500 text-sm mt-2">{errors.lugar}</p>}
                                </div>
                                <div>
                                    <label htmlFor="fecha_evento" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Fecha del Evento
                                    </label>
                                    <input
                                        type="date"
                                        id="fecha_evento"
                                        name="fecha_evento"
                                        value={data.fecha_evento}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    />
                                    {errors.fecha_evento && <p className="text-red-500 text-sm mt-2">{errors.fecha_evento}</p>}
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Guardar Cambios
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
