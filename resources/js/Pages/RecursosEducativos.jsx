import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function RecursosEducativos() {
    const { recursos = [], grupos = [] } = usePage().props; // Obtenemos los recursos educativos desde las props pasadas por Inertia

    // Estado para el formulario de creación de recurso
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        tipo: '',
        archivo: null,
        grupo_id: '', // Asegúrate de agregar este campo
    });

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

        const form = new FormData();
        form.append('titulo', formData.titulo);
        form.append('descripcion', formData.descripcion);
        form.append('tipo', formData.tipo);
        form.append('archivo', formData.archivo);
        form.append('grupo_id', formData.grupo_id); // Asegúrate de agregar este campo

        router.post('/recursos', form, {
            onSuccess: () => {
                alert('Recurso creado correctamente.');
                setFormData({ titulo: '', descripcion: '', tipo: '', archivo: null, grupo_id: '' }); // Limpiar formulario
            },
            onError: (error) => {
                alert('Ocurrió un error al crear el recurso.');
                console.log(error);
            },
        });
    };

    const handleDelete = (recursoId) => {
        if (confirm(`¿Estás seguro de que deseas eliminar este recurso con ID: ${recursoId}?`)) {
            router.delete(`/recursos/${recursoId}`, {
                onSuccess: () => alert('Recurso eliminado correctamente.'),
                onError: () => alert('Ocurrió un error al intentar eliminar el recurso.'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Administrar Recursos Educativos
                </h2>
            }
        >
            <Head title="Administrar Recursos Educativos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Formulario para crear un recurso */}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Crear un nuevo recurso educativo
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
                                        <option value="">Seleccionar tipo</option>
                                        <option value="PDF">PDF</option>
                                        <option value="DOCX">DOCX</option>
                                        <option value="PPTX">PPTX</option>
                                        <option value="Enlace Web">Enlace Web</option>
                                    </select>
                                </div>
                                 
                                 <div>
    <label htmlFor="grupo_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Selecciona el Grupo
    </label>
    <select name="grupo_id" id="grupo_id" value={formData.grupo_id} onChange={handleInputChange}>
        <option value="">Selecciona un grupo</option>
        {grupos.length > 0 ? (
            grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                    {grupo.nombre}
                </option>
            ))
        ) : (
            <option disabled>No hay grupos disponibles</option>
        )}
    </select>
</div>
                                <div>
                                    <label htmlFor="archivo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Archivo
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
                                    Crear Recurso
                                </button>
                            </form>

                            {/* Tabla de recursos existentes */}
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
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {recursos.map((recurso) => (
                                        <tr key={recurso.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{recurso.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{recurso.titulo}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{recurso.tipo}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{recurso.usuario?.name || 'Desconocido'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                <button
                                                    className="px-3 py-1 mr-2 text-white bg-red-500 rounded hover:bg-red-600"
                                                    onClick={() => handleDelete(recurso.id)}
                                                >
                                                    Eliminar
                                                </button>
                                                <Link
                                                    href={`/recursos/${recurso.id}/editar`}
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
