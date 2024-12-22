import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function EditarNoticia(props) {
    const { noticia } = props; // Obtener la noticia desde las props pasadas por Inertia

    const { data, setData, put, processing, errors } = useForm({
        titulo: noticia.titulo,
        descripcion: noticia.descripcion,
        lugar: noticia.lugar,
        fecha_evento: noticia.fecha_evento,
        imagen: null,
    });

    

    const handleSubmit = (e) => {
        e.preventDefault();

        const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
        if (formData.fecha_evento < today) {
            setError('La fecha del evento no puede ser anterior a la fecha actual.');
            return;
        }

        setError(''); // Limpiar error si la fecha es válida

        const form = new FormData();
        form.append('titulo', formData.titulo);
        form.append('descripcion', formData.descripcion);
        form.append('lugar', formData.lugar);
        form.append('fecha_evento', formData.fecha_evento);
        form.append('imagen', formData.imagen);

        router.put(`/noticias/${noticia.id}`, form, {
            onSuccess: () => {
                alert('Noticia modificada correctamente.');
            },
            onError: (error) => {
                alert('Ocurrió un error al modificar la noticia.');
                console.log(error);
                console.error('error actualizar:',error);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Editar Noticia
                </h2>
            }
        >
            <Head title="Editar Noticia" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Formulario para editar la noticia */}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Editar noticia
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
                                        
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    />
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
                                        
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                >
                                    Modificar Noticia
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
