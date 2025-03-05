import { useEffect, useState, useRef } from 'react'; // Agregado useRef
import { router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import {route} from "ziggy-js";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutos en segundos
    const [showTimer, setShowTimer] = useState(true); // Para mostrar/ocultar el contador

    const inactivityTimerRef = useRef(null);
    const countdownTimerRef = useRef(null);

    useEffect(() => {
        const resetTimer = () => {
            console.log('Actividad detectada, reiniciando temporizador');
            clearTimeout(inactivityTimerRef.current);
            clearInterval(countdownTimerRef.current);
            setTimeLeft(2.5 * 60); // Reiniciar el contador
            setShowTimer(true); // Ocultar el contador

            inactivityTimerRef.current = setTimeout(startCountdown, 2.5 * 60 * 1000); // Mostrar contador tras 4 min
        };

        const startCountdown = () => {
            console.log('Iniciando el contador de inactividad');
            setShowTimer(true); // Mostrar el contador

            countdownTimerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(countdownTimerRef.current);
                        logoutUser();
                        return 0;
                    }
                    console.log('Contador:', prevTime - 1);
                    return prevTime - 1;
                });
            }, 1000);
        };

        const logoutUser = () => {
            console.log('Cerrando sesión por inactividad');
            router.post(route('logout'));
        };

        // Eventos de actividad
        const events = ['keydown', 'scroll', 'touchstart'];
        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        // Iniciar el temporizador al montar el componente
        resetTimer();

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
            clearTimeout(inactivityTimerRef.current);
            clearInterval(countdownTimerRef.current);
        };
    }, []); // Corrección aquí

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Contador visual */}
            {showTimer && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    La sesión se cerrará en {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
            )}

            <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                {user.user_type === 'admin' && (
                                    <>
                                        <NavLink
                                            href={route('usuarios.index')}
                                            active={route().current('usuarios.index')}
                                        >
                                            Admin Usuarios
                                        </NavLink>
                                        <NavLink
                                            href={route('recursos.index')}
                                            active={route().current('recursos.index')}
                                        >
                                            Gestion Recursos Educativos
                                        </NavLink>
                                        <NavLink
                                            href={route('noticias.index')}
                                            active={route().current('noticias.index')}
                                        >
                                            Gestion Noticias
                                        </NavLink>
                                        <NavLink
                                            href={route('encuestas.index')}
                                            active={route().current('encuestas.index')}
                                        >
                                            Gestion Encuestas
                                        </NavLink>
                                        <NavLink
                                            href={route('grupos-colaboradores.index')}
                                            active={route().current('grupos-colaboradores.index')}
                                        >
                                            Gestión Grupos de Colaboradores
                                        </NavLink>
                                        <NavLink
                                            href={route('grupo-usuarios.index')}
                                            active={route().current('grupo-usuarios.index')}
                                        >
                                            Grupo Usuarios
                                        </NavLink>
                                        <NavLink
                                            href={route('backup-restore.index')}
                                            active={route().current('backup-restore.index')}
                                        >
                                            Respaldo y Restauración BD
                                        </NavLink>
                                        <NavLink
                                            href={route('preguntas.index')}
                                            active={route().current('preguntas.index')}
                                        >
                                            Foro de Preguntas
                                        </NavLink>
                                        <NavLink
                                            href={route('reportes.index')}
                                            active={route().current('reportes.index')}
                                        >
                                            Generar Reportes
                                        </NavLink>
                                    </>
                                )}

                                {user.user_type === 'profesor' && (
                                    <>
                                        <NavLink href={route('grupos-colaboradores.profesor')} active={route().current('grupos-colaboradores.profesor')}>
                                            Grupos de Colaboradores
                                        </NavLink>
                                        <NavLink href={route('recursos.profesor')} active={route().current('recursos.profesor')}>
                                            Ver Recursos Educativos
                                        </NavLink>
                                        <NavLink href={route('noticias.profesor')} active={route().current('noticias.profesor')}>
                                            Lista de Noticias
                                        </NavLink>
                                        <NavLink href={route('preguntas.index')}active={route().current('preguntas.index')}>
                                            Foro de Preguntas
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('notifications.show')}>
                                            Notifications
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown((previousState) => !previousState)
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('notifications.show')}>
                                Notifications
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
