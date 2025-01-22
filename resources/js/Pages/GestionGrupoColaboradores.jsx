import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function GestionGruposColaboradores() {
    const { grupos } = usePage().props;

    const [formData, setFormData] = useState({
        nombre: '',
        tipo: '',
        descripcion: '',
        temas_abordados: '',
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
        form.append('nombre', formData.nombre);
        form.append('tipo', formData.tipo);
        form.append('descripcion', formData.descripcion);
        form.append('temas_abordados', formData.temas_abordados);

        router.post('/grupos-colaboradores', form, {
            onSuccess: () => {
                alert('Grupo de Colaboradores creado correctamente.');
                setFormData({ nombre: '', tipo: '', descripcion: '', temas_abordados: '' });
            },
            onError: (error) => {
                alert('Ocurrió un error al crear el grupo de colaboradores.');
                console.error(error);
            },
        });
    };

    const handleDelete = (grupoId) => {
        if (confirm(`¿Estás seguro de que deseas eliminar este grupo de colaboradores con ID: ${grupoId}?`)) {
            router.delete(`/grupos-colaboradores/${grupoId}`, {
                onSuccess: () => alert('Grupo de colaboradores eliminado correctamente.'),
                onError: () => alert('Ocurrió un error al intentar eliminar el grupo de colaboradores.'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Administrar Grupos de Colaboradores</h2>}
        >
            <Head title="Administrar Grupos de Colaboradores" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-semibold mb-4">Crear un nuevo grupo de colaboradores</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-medium">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className="w-full p-2 mt-1 border rounded"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="tipo" className="block text-sm font-medium">
                                        Tipo
                                    </label>
                                    <input
                                        type="text"
                                        id="tipo"
                                        name="tipo"
                                        value={formData.tipo}
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
                                    <label htmlFor="temas_abordados" className="block text-sm font-medium">
                                        Temas Abordados
                                    </label>
                                    <textarea
                                        id="temas_abordados"
                                        name="temas_abordados"
                                        value={formData.temas_abordados}
                                        onChange={handleInputChange}
                                        className="w-full p-2 mt-1 border rounded"
                                    ></textarea>
                                </div>
                                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" type="submit">
                                    Crear Grupo de Colaboradores
                                </button>
                            </form>

                            <h3 className="text-lg font-semibold mt-8">Grupos de Colaboradores Existentes</h3>
                            <table className="w-full mt-4">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">ID</th>
                                        <th className="border px-4 py-2">Nombre</th>
                                        <th className="border px-4 py-2">Tipo</th>
                                        <th className="border px-4 py-2">Descripción</th>
                                        <th className="border px-4 py-2">Temas Abordados</th>
                                        <th className="border px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grupos.map((grupo) => (
                                        <tr key={grupo.id}>
                                            <td className="border px-4 py-2">{grupo.id}</td>
                                            <td className="border px-4 py-2">{grupo.nombre}</td>
                                            <td className="border px-4 py-2">{grupo.tipo}</td>
                                            <td className="border px-4 py-2">{grupo.descripcion}</td>
                                            <td className="border px-4 py-2">{grupo.temas_abordados}</td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 mr-2"
                                                    onClick={() => handleDelete(grupo.id)}
                                                >
                                                    Eliminar
                                                </button>
                                                <Link
                                                    href={`/grupos-colaboradores/${grupo.id}/editar`}
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
