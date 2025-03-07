import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function AdminUsuarios() {
    const { users } = usePage().props;

    const handleDelete = (userId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar al usuario con ID: ${userId}? Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/usuarios/${userId}`, {
                    onSuccess: () => {
                        Swal.fire('Eliminado', 'El usuario ha sido eliminado correctamente.', 'success');
                    },
                    onError: () => {
                        Swal.fire('Error', 'Hubo un problema al eliminar el usuario.', 'error');
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            
        >
            <Head title="Administrar Usuarios" />

            <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 text-white min-h-screen flex flex-col items-center justify-center py-12">
                {/* Imagen de fondo con opacidad */}
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        className="object-cover w-full h-full opacity-30"
                        src="https://images.unsplash.com/photo-1533750342991-d26d54d839b7"
                        alt="Background"
                    />
                </div>

                <div className="relative bg-white bg-opacity-60 text-gray-800 shadow-lg rounded-2xl p-8 max-w-7xl w-full space-y-6">
                    <h1 className="text-4xl font-extrabold mb-4 text-gray-800">Administrar Usuarios</h1>

                    {/* Tabla de usuarios */}
                    <div className="overflow-x-auto w-full mt-8">
                        <table className="w-full border-collapse shadow-lg rounded-2xl overflow-hidden">
                            {/* Encabezado */}
                            <thead className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Nombre</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Apellidos</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Género</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Grado Académico</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Nacimiento</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Foto</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Tipo Usuario</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold uppercase">Acciones</th>
                                </tr>
                            </thead>

                            {/* Cuerpo de la tabla */}
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user, index) => (
                                    <tr key={user.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200 transition`}>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.nombre}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.apellidos}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.genero}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.gradoAcademico}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.fechaNacimiento}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {user.foto && <img src={`/storage/${user.foto}`} alt="Foto" className="w-10 h-10 rounded-full" />}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{user.user_type}</td>
                                        <td className="px-6 py-4 flex space-x-2 justify-center">
                                            <button
                                                className="px-4 py-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-105"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Eliminar
                                            </button>
                                            <Link
                                                href={`/usuarios/${user.id}/editar`}
                                                className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 transform hover:scale-105"
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
        </AuthenticatedLayout>
    );
}
