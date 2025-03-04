import { Head, Link } from '@inertiajs/react';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';


export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Bienvenido" />
            <div className="relative bg-gradient-to-r from-teal-400 to-blue-500 text-white min-h-screen flex flex-col items-center justify-center">
                {/* Imagen de fondo con un efecto de parallax */}
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        className="object-cover w-full h-full opacity-50"
                        src="https://images.unsplash.com/photo-1533750342991-d26d54d839b7"
                        alt="Background"
                    />
                </div>
                
                {/* Contenedor principal */}
                <div className="relative bg-white bg-opacity-60 text-gray-800 shadow-lg rounded-2xl p-8 max-w-lg w-full text-center space-y-6">
                    <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
                        ¡Bienvenido a la Plataforma Educativa!
                    </h1>
                    <p className="text-lg text-gray-700 mb-6">
                        Explora y accede a una variedad de recursos educativos abiertos diseñados para mejorar la enseñanza.
                    </p>

                    {/* Opciones de navegación */}
                    <nav className="flex flex-col space-y-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-300 transform hover:scale-105"
                            >
                                <span className="mr-2">Ir al Dashboard</span>
                                <FaSignInAlt />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-xl transition duration-300 transform hover:scale-105"
                                >
                                    <span className="mr-2">Iniciar Sesión</span>
                                    <FaSignInAlt />
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-300 transform hover:scale-105"
                                >
                                    <span className="mr-2">Registrarse</span>
                                    <FaUserPlus />
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </>
    );
}
