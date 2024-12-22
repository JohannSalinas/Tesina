import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function EditarEncuesta({ encuesta }) {
    const { data, setData, put, errors } = useForm({
        titulo: encuesta.titulo,
        descripcion: encuesta.descripcion || '',
        preguntas: encuesta.preguntas || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/encuestas/${encuesta.id}`, {
            onSuccess: () => alert('Encuesta actualizada correctamente.'),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Editar Encuesta</h2>}
        >
            <Head title="Editar Encuesta" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="titulo" className="block text-sm font-medium">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        value={data.titulo}
                                        onChange={(e) => setData('titulo', e.target.value)}
                                        className="w-full p-2 mt-1 border rounded"
                                    />
                                    {errors.titulo && <span className="text-red-500 text-sm">{errors.titulo}</span>}
                                </div>
                                <div>
                                    <label htmlFor="descripcion" className="block text-sm font-medium">
                                        Descripción
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                        className="w-full p-2 mt-1 border rounded"
                                    ></textarea>
                                    {errors.descripcion && <span className="text-red-500 text-sm">{errors.descripcion}</span>}
                                </div>
                                <div>
                                    <label htmlFor="preguntas" className="block text-sm font-medium">
                                        Preguntas
                                    </label>
                                    <textarea
                                        id="preguntas"
                                        name="preguntas"
                                        value={data.preguntas}
                                        onChange={(e) => setData('preguntas', e.target.value)}
                                        className="w-full p-2 mt-1 border rounded"
                                    ></textarea>
                                    {errors.preguntas && <span className="text-red-500 text-sm">{errors.preguntas}</span>}
                                </div>
                                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" type="submit">
                                    Actualizar Encuesta
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
