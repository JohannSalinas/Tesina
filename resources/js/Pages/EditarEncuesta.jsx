import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function EditarEncuesta({ encuesta }) {
    const { data, setData, put, errors } = useForm({
        titulo: encuesta.titulo,
        descripcion: encuesta.descripcion || '',
        preguntas: encuesta.preguntas.map((pregunta) => pregunta.pregunta), // Solo los textos de las preguntas
    });

    const handlePreguntaChange = (index, e) => {
        const updatedPreguntas = [...data.preguntas];
        updatedPreguntas[index] = e.target.value;
        setData('preguntas', updatedPreguntas);
    };

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
                                
                                {/* Aquí ya no se permite cambiar el número de preguntas */}
                                <div>
                                    <label htmlFor="numPreguntas" className="block text-sm font-medium">
                                        Número de Preguntas (no editable)
                                    </label>
                                    <input
                                        type="number"
                                        id="numPreguntas"
                                        name="numPreguntas"
                                        value={encuesta.preguntas.length} // Mostrar el número actual de preguntas
                                        disabled
                                        className="w-full p-2 mt-1 border rounded bg-gray-100"
                                    />
                                </div>

                                {/* Renderizamos las preguntas y permitimos su edición */}
                                {data.preguntas.map((pregunta, index) => (
                                    <div key={index}>
                                        <label htmlFor={`pregunta_${index + 1}`} className="block text-sm font-medium">
                                            Pregunta {index + 1}
                                        </label>
                                        <input
                                            type="text"
                                            id={`pregunta_${index + 1}`}
                                            name={`preguntas[${index}]`}
                                            value={pregunta}
                                            onChange={(e) => handlePreguntaChange(index, e)}
                                            className="w-full p-2 mt-1 border rounded"
                                        />
                                        {errors.preguntas && errors.preguntas[index] && (
                                            <span className="text-red-500 text-sm">{errors.preguntas[index]}</span>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                >
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
