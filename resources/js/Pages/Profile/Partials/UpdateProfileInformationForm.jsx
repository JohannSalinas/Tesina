import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    console.log(user);
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            nombre: user.nombre,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            onSuccess: () => {
                // Alerta de éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Perfil actualizado!',
                    text: 'La información de tu perfil se ha actualizado correctamente.',
                    confirmButtonColor: '#4CAF50',
                });
            },
            onError: () => {
                // Alerta de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un problema al actualizar tu perfil.',
                    confirmButtonColor: '#F44336',
                });
            },
        });
    };

    return (
        <section className={`${className} bg-white bg-opacity-60 p-8 rounded-2xl shadow-lg`}>
            <header>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Información del Perfil
                </h2>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Actualiza la información de tu perfil y dirección de correo electrónico.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Campo de Nombre */}
                <div>
                    <InputLabel htmlFor="nombre" value="Nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300" />

                    <TextInput
                        id="nombre"
                        className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        required
                        isFocused
                        autoComplete="nombre"
                    />

                    <InputError className="mt-2 text-sm text-red-600" message={errors.nombre} />
                </div>

                {/* Campo de Email */}
                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" className="block text-sm font-medium text-gray-700 dark:text-gray-300" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-2 block w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2 text-sm text-red-600" message={errors.email} />
                </div>

                {/* Verificación de Email */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Tu dirección de correo electrónico no está verificada.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 text-sm text-yellow-700 underline hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:text-yellow-300 dark:hover:text-yellow-400"
                            >
                                Haz clic aquí para reenviar el correo de verificación.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                            </div>
                        )}
                    </div>
                )}

                {/* Botón de Guardar y Mensaje de Éxito */}
                <div className="flex items-center gap-4">
                    <PrimaryButton
                        disabled={processing}
                        className="w-full bg-teal-600 text-white py-3 px-6 rounded-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                    >
                        Guardar
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 dark:text-green-400">
                            Guardado.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}