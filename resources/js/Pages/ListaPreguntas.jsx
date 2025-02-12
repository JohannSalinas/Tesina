import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Notification from "@/Components/Notifications";

const ListaPreguntas = ({ preguntas }) => {
    // Formulario para preguntas
    const preguntaForm = useForm({
        pregunta: '',
    });

    // Estados para manejar respuestas
    const [respuestas, setRespuestas] = useState({});
    const [nuevaRespuesta, setNuevaRespuesta] = useState({});
    const [processingRespuesta, setProcessingRespuesta] = useState({});

    // Manejar el envío de una nueva pregunta
    const handleSubmit = (e) => {
        e.preventDefault();
        preguntaForm.post(route('preguntas.store'), {
            onSuccess: () => preguntaForm.reset()
        });
    };

    // Manejar el envío de una nueva respuesta
    const [mensaje, setMensaje] = useState(null);
    const [tipoMensaje, setTipoMensaje] = useState(null);

    const handleRespuestaSubmit = (e, preguntaId) => {
        e.preventDefault();

        if (!nuevaRespuesta[preguntaId]) {
            return;
        }

        setProcessingRespuesta(prev => ({
            ...prev,
            [preguntaId]: true
        }));

        axios.post(route('respuestas.store'), {
            pregunta_id: preguntaId,
            respuesta: nuevaRespuesta[preguntaId]
        })
            .then(() => {
                setNuevaRespuesta(prev => ({
                    ...prev,
                    [preguntaId]: ''
                }));

                setMensaje("Respuesta agregada correctamente.");
                setTipoMensaje("success");

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch(error => {
                console.error('Error al enviar respuesta:', error);

                setMensaje("Limite de respuestas por pregunta alcanzado.");
                setTipoMensaje("error");
            })
            .finally(() => {
                setProcessingRespuesta(prev => ({
                    ...prev,
                    [preguntaId]: false
                }));

                setTimeout(() => {
                    setMensaje(null);
                    setTipoMensaje(null);
                }, 3000);
            });
    };


    return (
        <AuthenticatedLayout>
            <Head title="Foro - Preguntas" />
            <div className="container mx-auto py-10 px-5">
                {/* Formulario de pregunta */}
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
                                value={preguntaForm.data.pregunta}
                                onChange={e => preguntaForm.setData('pregunta', e.target.value)}
                                id="pregunta"
                                placeholder="Escribe tu pregunta aquí..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {preguntaForm.errors.pregunta && (
                                <div className="text-red-600 text-sm mt-2">{preguntaForm.errors.pregunta}</div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={preguntaForm.processing}
                            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {preguntaForm.processing ? 'Enviando...' : 'Realizar Pregunta'}
                        </button>
                    </form>
                </div>

                {/* Lista de preguntas */}
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

                            {/* Formulario de respuesta */}
                            <div className="mt-4 p-4 border-t border-gray-200">
                                <form onSubmit={(e) => handleRespuestaSubmit(e, pregunta.id)}>
                                    {/* Notificación */}
                                    <Notification
                                        message={mensaje}
                                        type={tipoMensaje}
                                        onClose={() => setMensaje(null)}
                                    />
                                    <input
                                        type="text"
                                        name="respuesta"
                                        value={nuevaRespuesta[pregunta.id] || ''}
                                        onChange={(e) => setNuevaRespuesta(prev => ({
                                            ...prev,
                                            [pregunta.id]: e.target.value
                                        }))}
                                        placeholder="Escribe tu respuesta..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <input
                                        type="hidden"
                                        name="pregunta_id"
                                        value={pregunta.id}
                                    />
                                    <button
                                        type="submit"
                                        disabled={processingRespuesta[pregunta.id]}
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
