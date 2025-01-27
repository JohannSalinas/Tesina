import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';

export default function GruposUsuario() {
    const { gruposColaboradores = [] } = usePage().props;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Grupos de Usuarios</h2>}
        >
            <Head title="Grupos de Usuarios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {Array.isArray(gruposColaboradores) && gruposColaboradores.length > 0 ? (
                        gruposColaboradores.map((grupo) => (
                            <div key={grupo.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                                <div className="p-6 text-gray-900 dark:text-gray-100">
                                    <h3 className="text-lg font-semibold mb-4">Usuarios en el Grupo: {grupo.nombre}</h3>
                                    <table className="w-full mt-4">
                                        <thead>
                                        <tr>
                                            <th className="border px-4 py-2">ID</th>
                                            <th className="border px-4 py-2">Nombre</th>
                                            <th className="border px-4 py-2">Email</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {grupo.usuarios && grupo.usuarios.length > 0 ? (
                                            grupo.usuarios.map((usuario) => (
                                                <tr key={usuario.id}>
                                                    <td className="border px-4 py-2">{usuario.id}</td>
                                                    <td className="border px-4 py-2">{usuario.nombre}</td>
                                                    <td className="border px-4 py-2">{usuario.email}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="border px-4 py-2 text-center">No hay usuarios en este grupo.</td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <p className="text-center">No hay grupos para mostrar.</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <Link href="/grupos-colaboradores" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                            Regresar a los Grupos
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
