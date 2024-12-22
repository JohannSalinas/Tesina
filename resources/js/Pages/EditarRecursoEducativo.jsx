import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function EditarRecursoEducativo() {
    const { recurso } = usePage().props;  // Recibe el recurso pasado desde el controlador
    const [formData, setFormData] = useState({
        titulo: recurso.titulo,
        descripcion: recurso.descripcion,
        tipo: recurso.tipo,
        archivo: null,
    });

    useEffect(() => {
        setFormData({
            titulo: recurso.titulo,
            descripcion: recurso.descripcion,
            tipo: recurso.tipo,
            archivo: null, // Si no se desea actualizar el archivo, lo dejamos null
        });
    }, [recurso]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });  // Asegúrate de que el archivo se agregue correctamente
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Crear el FormData para enviar
        const form = new FormData();
        form.append('titulo', formData.titulo);
        form.append('descripcion', formData.descripcion);
        form.append('tipo', formData.tipo);
    
        // Solo agregamos el archivo si se ha seleccionado uno
        if (formData.archivo) {
            form.append('archivo', formData.archivo);
        }
    
        // Asegurarse de que los datos se estén enviando correctamente
        console.log('Datos enviados al controlador:', {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            tipo: formData.tipo,
            archivo: formData.archivo ? formData.archivo.name : null,
        });
    
        router.put(`/recursos/${recurso.id}`, form, {
            onSuccess: () => alert('Recurso actualizado correctamente.'),
            onError: () => alert('Ocurrió un error al actualizar el recurso.'),
        });
    };
    

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Editar Recurso Educativo
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                                {/* Agregar campo oculto para método PUT */}
                                <input type="hidden" name="_method" value="PUT" />

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
                                        type="text"
                                        id="descripcion"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
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
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    >
                                        <option value="PDF">PDF</option>
                                        <option value="DOCX">DOCX</option>
                                        <option value="PPTX">PPTX</option>
                                        <option value="Enlace Web">Enlace Web</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="archivo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Archivo (opcional)
                                    </label>
                                    <input
                                        type="file"
                                        id="archivo"
                                        name="archivo"
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                >
                                    Actualizar Recurso
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
