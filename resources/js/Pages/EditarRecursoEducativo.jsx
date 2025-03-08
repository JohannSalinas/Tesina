import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';

export default function EditarRecursoEducativo() {
    const { recurso } = usePage().props; // Recibe el recurso desde el backend
    const [formData, setFormData] = useState({
        titulo: recurso.titulo,
        descripcion: recurso.descripcion,
        tipo: recurso.tipo,
        archivo: null,
        url: recurso.url,
    });

    useEffect(() => {
        setFormData({
            titulo: recurso.titulo,
            descripcion: recurso.descripcion,
            tipo: recurso.tipo,
            archivo: recurso.tipo !== 'Enlace Web' ? null : undefined, // El archivo es opcional y solo se selecciona si el usuario lo modifica
            url: recurso.tipo === 'Enlace Web' ? recurso.url : undefined,
        });
    }, [recurso]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append('titulo', formData.titulo);
        form.append('descripcion', formData.descripcion);
        form.append('tipo', formData.tipo);

        if (formData.archivo && formData.tipo !== 'Enlace Web') {
            form.append('archivo', formData.archivo);
        }else{
            form.append('url', formData.url);
        }

        form.append('_method', 'PUT');

        router.post(`/recursos/${recurso.id}`, form, {
            onSuccess: () => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Recurso actualizado correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#2563eb',
                });
            },
            onError: () => {
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al actualizar el recurso.',
                    icon: 'error',
                    confirmButtonColor: '#dc2626',
                });
            },
        });
    };

    return (
        <AuthenticatedLayout>
            {/* Fondo degradado de azul a verde */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-500 px-4">
                <div className="max-w-3xl w-full">
                    {/* Formulario con opacidad y desenfoque */}
                    <div className="bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 backdrop-blur-lg shadow-xl rounded-xl p-8">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-6">
                            Editar Recurso Educativo
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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
                                    className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
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
                                    className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tipo
                                </label>
                                <select
                                    id="tipo"
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                >
                                    <option value="PDF">PDF</option>
                                    <option value="DOCX">DOCX</option>
                                    <option value="PPTX">PPTX</option>
                                    <option value="Enlace Web">Enlace Web</option>
                                </select>
                            </div>
                            {formData.tipo === 'Enlace Web' ? (
                                <div>
                                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        URL
                                    </label>
                                    <input
                                        type="url"
                                        id="url"
                                        name="url"
                                        value={formData.url || ''}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="archivo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Archivo (opcional)
                                    </label>
                                    <input
                                        type="file"
                                        id="archivo"
                                        name="archivo"
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                    />
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                            >
                                Actualizar Recurso
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
