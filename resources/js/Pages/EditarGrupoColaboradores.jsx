import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function EditarGrupoColaboradores() {
    const { grupoColaborador, flash } = usePage().props;

    const [formData, setFormData] = useState({
        nombre: grupoColaborador.nombre || '',
        tipo: grupoColaborador.tipo || '',
        descripcion: grupoColaborador.descripcion || '',
        temas_abordados: grupoColaborador.temas_abordados || '',
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

        // Enviar la solicitud de actualización
        router.put(`/grupos-colaboradores/${grupoColaborador.id}`, formData, {
            onSuccess: () => {
                // Mostrar mensaje de éxito y redirigir
                alert('Grupo de colaboradores actualizado correctamente.');
                router.visit('/grupos-colaboradores');
            },
            onError: (error) => {
                alert('Ocurrió un error al actualizar el grupo de colaboradores.');
                console.error(error);
            },
        });
    };

    useEffect(() => {
        // Verificar si flash está definido y contiene el mensaje success
        if (flash && flash.success) {
            alert(flash.success); // Mostrar el mensaje de éxito
        }
    }, [flash]);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Editar Grupo de Colaboradores</h2>}
        >
            <Head title="Editar Grupo de Colaboradores" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-semibold mb-4">Modificar los detalles del grupo de colaboradores</h3>

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
                                    Actualizar Grupo
                                </button>
                            </form>

                            <Link
                                href="/grupos-colaboradores"
                                className="mt-4 text-blue-500 hover:text-blue-700"
                            >
                                Regresar a la lista de grupos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
