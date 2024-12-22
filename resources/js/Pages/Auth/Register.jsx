import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        password_confirmation: '',
        user_type: 'profesor', // Valor predeterminado
        genero: 'otro', // Valor predeterminado
        gradoAcademico: 'licenciatura', // Valor predeterminado
        fechaNacimiento: '',
        foto: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setData(name, files[0]);
        } else {
            setData(name, value);
        }
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="nombre" value="Nombre" />
                    <TextInput
                        id="nombre"
                        name="nombre"
                        value={data.nombre}
                        className="mt-1 block w-full"
                        autoComplete="nombre"
                        isFocused={true}
                        onChange={handleInputChange}
                        required
                    />
                    <InputError message={errors.nombre} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="apellidos" value="Apellidos" />
                    <TextInput
                        id="apellidos"
                        name="apellidos"
                        value={data.apellidos}
                        className="mt-1 block w-full"
                        autoComplete="apellidos"
                        onChange={handleInputChange}
                        required
                    />
                    <InputError message={errors.apellidos} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={handleInputChange}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={handleInputChange}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={handleInputChange}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="user_type" value="User Type" />
                    <select
                        id="user_type"
                        name="user_type"
                        value={data.user_type}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        onChange={handleInputChange}
                        required
                    >
                        <option value="profesor">Profesor</option>
                        <option value="coordinador">Coordinador</option>
                    </select>
                    <InputError message={errors.user_type} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="genero" value="Género" />
                    <select
                        id="genero"
                        name="genero"
                        value={data.genero}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        onChange={handleInputChange}
                        required
                    >
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                    </select>
                    <InputError message={errors.genero} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="gradoAcademico" value="Grado Académico" />
                    <select
                        id="gradoAcademico"
                        name="gradoAcademico"
                        value={data.gradoAcademico}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        onChange={handleInputChange}
                        required
                    >
                        <option value="licenciatura">Licenciatura</option>
                        <option value="maestria">Maestría</option>
                        <option value="doctorado">Doctorado</option>
                    </select>
                    <InputError message={errors.gradoAcademico} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="fechaNacimiento" value="Fecha de Nacimiento" />
                    <TextInput
                        id="fechaNacimiento"
                        type="date"
                        name="fechaNacimiento"
                        value={data.fechaNacimiento}
                        className="mt-1 block w-full"
                        autoComplete="bday"
                        onChange={handleInputChange}
                        required
                    />
                    <InputError message={errors.fechaNacimiento} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="foto" value="Foto" />
                    <input
                        id="foto"
                        type="file"
                        name="foto"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        onChange={handleInputChange}
                    />
                    <InputError message={errors.foto} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
