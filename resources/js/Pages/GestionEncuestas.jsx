import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function GestionEncuestas() {
    const { encuestas } = usePage().props;

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        numPreguntas: 1, // Valor inicial para el número de preguntas
        preguntas: [''], // Pregunta inicial vacía
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePreguntaChange = (index, e) => {
        const updatedPreguntas = [...formData.preguntas];
        updatedPreguntas[index] = e.target.value;
        setFormData({
            ...formData,
            preguntas: updatedPreguntas,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Usar FormData para enviar los datos como un formulario
        const form = new FormData();
        form.append('titulo', formData.titulo);
        form.append('descripcion', formData.descripcion);
        form.append('numPreguntas', formData.numPreguntas);

        // Enviar cada pregunta individualmente como un campo
        formData.preguntas.forEach((pregunta, index) => {
            form.append(`preguntas[${index}]`, pregunta);
        });

        router.post('/encuestas', form, {
            onSuccess: () => {
                alert('Encuesta creada correctamente.');
                setFormData({ titulo: '', descripcion: '', numPreguntas: 1, preguntas: [''] });
            },
            onError: (error) => {
                alert('Ocurrió un error al crear la encuesta.');
                console.error(error);
            },
        });
    };

    const handleDelete = (encuestaId) => {
        if (confirm(`¿Estás seguro de que deseas eliminar esta encuesta con ID: ${encuestaId}?`)) {
            router.delete(`/encuestas/${encuestaId}`, {
                onSuccess: () => alert('Encuesta eliminada correctamente.'),
                onError: () => alert('Ocurrió un error al intentar eliminar la encuesta.'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Administrar Encuestas</h2>}
        >
            <Head title="Administrar Encuestas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-semibold mb-4">Crear una nueva encuesta</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="titulo" className="block text-sm font-medium">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        value={formData.titulo}
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
                                    <label htmlFor="numPreguntas" className="block text-sm font-medium">
                                        Número de Preguntas
                                    </label>
                                    <input
                                        type="number"
                                        id="numPreguntas"
                                        name="numPreguntas"
                                        value={formData.numPreguntas}
                                        min="1"
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                numPreguntas: e.target.value,
                                                preguntas: new Array(parseInt(e.target.value)).fill(''),
                                            });
                                        }}
                                        className="w-full p-2 mt-1 border rounded"
                                    />
                                </div>
                                {/* Renderizamos dinámicamente los campos de preguntas */}
                                {Array.from({ length: formData.numPreguntas }, (_, index) => (
                                    <div key={index}>
                                        <label htmlFor={`pregunta_${index + 1}`} className="block text-sm font-medium">
                                            Pregunta {index + 1}
                                        </label>
                                        <input
                                            type="text"
                                            id={`pregunta_${index + 1}`}
                                            name={`preguntas[${index}]`}
                                            value={formData.preguntas[index]}
                                            onChange={(e) => handlePreguntaChange(index, e)}
                                            className="w-full p-2 mt-1 border rounded"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                >
                                    Crear Encuesta
                                </button>
                            </form>

                            <h3 className="text-lg font-semibold mt-8">Encuestas Existentes</h3>
                            <table className="w-full mt-4">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">ID</th>
                                        <th className="border px-4 py-2">Título</th>
                                        <th className="border px-4 py-2">Descripción</th>
                                        <th className="border px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {encuestas.map((encuesta) => (
                                        <tr key={encuesta.id}>
                                            <td className="border px-4 py-2">{encuesta.id}</td>
                                            <td className="border px-4 py-2">{encuesta.titulo}</td>
                                            <td className="border px-4 py-2">{encuesta.descripcion}</td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 mr-2"
                                                    onClick={() => handleDelete(encuesta.id)}
                                                >
                                                    Eliminar
                                                </button>
                                                <Link
                                                    href={`/encuestas/${encuesta.id}/editar`}
                                                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                                >
                                                    Modificar
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Tabla de preguntas relacionadas con la encuesta */}
                            {encuestas.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4">Preguntas de la Encuesta</h3>
                                    {encuestas.map((encuesta) => (
                                        <div key={encuesta.id}>
                                            <h4 className="text-lg font-semibold">{encuesta.titulo}</h4>
                                            <table className="w-full mt-4 border">
                                                <thead>
                                                    <tr>
                                                        <th className="border px-4 py-2">ID Pregunta</th>
                                                        <th className="border px-4 py-2">ID Encuesta</th>
                                                        <th className="border px-4 py-2">Pregunta</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {encuesta.preguntas.map((pregunta) => (
                                                        <tr key={pregunta.id}>
                                                            <td className="border px-4 py-2">{pregunta.id}</td>
                                                            <td className="border px-4 py-2">{pregunta.encuesta_id}</td>
                                                            <td className="border px-4 py-2">{pregunta.pregunta}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
