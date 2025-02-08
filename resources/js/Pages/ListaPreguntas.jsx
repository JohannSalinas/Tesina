import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const ListaPreguntas = ({ preguntas }) => {
    const { data, setData, post, processing, errors } = useForm({
        pregunta: '',
    });

    // Estado para almacenar respuestas de cada pregunta
    const [respuestas, setRespuestas] = useState({});
    const [nuevaRespuesta, setNuevaRespuesta] = useState({});
    const [processingRespuesta, setProcessingRespuesta] = useState({}); // Estado de procesamiento para respuestas

    // Manejar el envío de una nueva pregunta
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('preguntas.store'), {
            data,
            onSuccess: () => {
                setData('pregunta', ''); // Limpiar el campo de pregunta
            },
            onError: (errors) => {
                console.log(errors);
            },
        });
    };

    const handleRespuestaSubmit = (e, preguntaId) => {
        e.preventDefault();

        if (!nuevaRespuesta[preguntaId]) {
            return;
        }

        // Establecer el estado de procesamiento solo para esta respuesta
        setProcessingRespuesta((prevState) => ({
            ...prevState,
            [preguntaId]: true, // Indicar que esta respuesta está procesándose
        }));

        post(route('respuestas.store'), {
            pregunta_id: preguntaId,
            respuesta: nuevaRespuesta[preguntaId],
        }, {
            preserveScroll: true,
            onSuccess: (response) => {
                // Limpiar el campo de respuesta
                setNuevaRespuesta({ ...nuevaRespuesta, [preguntaId]: '' });
                
                // Actualizar las respuestas locales con la respuesta del servidor
                setRespuestas((prevRespuestas) => ({
                    ...prevRespuestas,
                    [preguntaId]: [
                        ...(prevRespuestas[preguntaId] || []),
                        response.respuesta // Usar la respuesta devuelta por el servidor
                    ],
                }));

                // Finalizar el procesamiento de la respuesta
                setProcessingRespuesta((prevState) => ({
                    ...prevState,
                    [preguntaId]: false, // Resetear el estado de procesamiento
                }));
            },
            onError: (errors) => {
                console.error('Error al enviar respuesta:', errors);

                // Finalizar el procesamiento de la respuesta en caso de error
                setProcessingRespuesta((prevState) => ({
                    ...prevState,
                    [preguntaId]: false, // Resetear el estado de procesamiento
                }));
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Foro - Preguntas" />
            <div className="container mx-auto py-10 px-5">
                {/* Formulario para crear una nueva pregunta */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">Haz una nueva pregunta</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="pregunta" className="block text-lg text-gray-600 font-medium mb-2">
                                ¿Cuál es tu pregunta?
                            </label>
                            <input
                                type="text"
                                name="pregunta"
                                value={data.pregunta}
                                onChange={(e) => setData('pregunta', e.target.value)}
                                id="pregunta"
                                placeholder="Escribe tu pregunta aquí..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.pregunta && (
                                <div className="text-red-600 text-sm mt-2">{errors.pregunta}</div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={processing} // Deshabilitar solo cuando se está procesando la pregunta
                            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {processing ? 'Enviando...' : 'Realizar Pregunta'}
                        </button>
                    </form>
                </div>

                {/* Mostrar todas las preguntas con sus respuestas */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preguntas del Foro</h2>
                    {preguntas.map((pregunta) => (
                        <div key={pregunta.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-lg font-semibold text-gray-800">{pregunta.usuario?.name || 'Anónimo'}</div>
                                <div className="text-sm text-gray-500">{new Date(pregunta.created_at).toLocaleString()}</div>
                            </div>
                            <p className="text-gray-700 text-lg">{pregunta.pregunta}</p>

                            {/* Respuestas */}
                            <div className="mt-4 space-y-4">
                                {[...(pregunta.respuestas || []), ...(respuestas[pregunta.id] || [])].map((respuesta) => (
                                    <div key={respuesta.id} className="bg-gray-100 rounded-lg p-4 shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <div className="text-md font-semibold text-gray-800">{respuesta.usuario?.name || 'Anónimo'}</div>
                                            <div className="text-sm text-gray-500">{new Date(respuesta.created_at).toLocaleString()}</div>
                                        </div>
                                        <p className="text-gray-600 mt-2">{respuesta.respuesta}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Formulario para responder */}
                            <div className="mt-4 p-4 border-t border-gray-200">
                                <form onSubmit={(e) => handleRespuestaSubmit(e, pregunta.id)}>
                                    <input
                                        type="text"
                                        value={nuevaRespuesta[pregunta.id] || ''}
                                        onChange={(e) => setNuevaRespuesta({ ...nuevaRespuesta, [pregunta.id]: e.target.value })}
                                        placeholder="Escribe tu respuesta..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        disabled={processingRespuesta[pregunta.id]} // Deshabilitar solo si se está procesando la respuesta
                                        className="mt-2 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        {processingRespuesta[pregunta.id] ? 'Enviando...' : 'Responder'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ListaPreguntas;
