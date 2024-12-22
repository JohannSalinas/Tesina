import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';

export default function Adminusuarios() {
    const { users } = usePage().props; // Obtenemos los usuarios desde las props pasadas por Inertia

    const handleDelete = (userId) => {
        if (confirm(`¿Estás seguro de que deseas eliminar este usuario con ID: ${userId}?`)) {
            router.delete(`/usuarios/${userId}`, {
                onSuccess: () => alert('Usuario eliminado correctamente.'),
                onError: () => alert('Ocurrió un error al intentar eliminar el usuario.'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Administrar usuarios
                </h2>
            }
        >
            <Head title="Administrar usuarios" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Tipo de Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{user.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{user.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{user.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{user.user_type}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                <button
                                                    className="px-3 py-1 mr-2 text-white bg-red-500 rounded hover:bg-red-600"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    Eliminar
                                                </button>
                                                <Link
                                                    href={`/usuarios/${user.id}/editar`}
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