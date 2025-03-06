import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Asegúrate de importar tu layout

export default function ListaEncuesta() {
    const { encuestas } = usePage().props;
    const [respuestas, setRespuestas] = useState({}); // Para almacenar las respuestas del usuario
    const [encuestasRespondidas, setEncuestasRespondidas] = useState({}); // Estado para llevar control de las encuestas respondidas

    useEffect(() => {
        if (encuestas.length === 0) {
            Swal.fire({
                title: "Sin encuestas",
                text: "Aún no hay encuestas disponibles.",
                icon: "info",
                confirmButtonColor: "#4F46E5",
            });
        }
    }, [encuestas]);

    const opcionesRespuesta = [
        "Totalmente de acuerdo",
        "De acuerdo",
        "Neutral",
        "En desacuerdo",
        "Totalmente en desacuerdo",
    ];

    // Verificar si todas las preguntas fueron respondidas
    const todasRespondidas = (preguntas) => {
        for (let pregunta of preguntas) {
            if (!respuestas[pregunta.id]) {
                return false;
            }
        }
        return true;
    };

    // Manejar cambio en las respuestas
    const handleRespuestaChange = (preguntaId, respuesta) => {
        setRespuestas({
            ...respuestas,
            [preguntaId]: respuesta,
        });
    };

    const enviarEncuesta = async (encuestaId) => {
        // Aquí, usa encuestaId en lugar de encuesta directamente
        const encuesta = encuestas.find((encuesta) => encuesta.id === encuestaId);

        if (!encuesta) {
            Swal.fire({
                title: "Error",
                text: "Encuesta no encontrada.",
                icon: "error",
                confirmButtonColor: "#4F46E5",
            });
            return;
        }

        if (!todasRespondidas(encuesta.preguntas_encuesta)) {
            Swal.fire({
                title: "Error",
                text: "Por favor, responde todas las preguntas.",
                icon: "error",
                confirmButtonColor: "#4F46E5",
            });
            return;
        }

        // Aquí enviamos las respuestas al backend
        try {
            await axios.post(`/encuestas/${encuestaId}/responder`, {
                respuestas,
            });

            Swal.fire({
                title: "Encuesta enviada",
                text: "Gracias por completar la encuesta.",
                icon: "success",
                confirmButtonColor: "#4F46E5",
            });

            // Cerrar encuesta (en el backend actualizar el estado de la encuesta)
            setEncuestasRespondidas({
                ...encuestasRespondidas,
                [encuestaId]: true,
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Hubo un error al enviar la encuesta.",
                icon: "error",
                confirmButtonColor: "#4F46E5",
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 p-6">
                <h1 className="text-3xl font-bold text-white text-center mb-6">📊 Encuestas</h1>

                {encuestas.length === 0 ? (
                    <div className="text-center text-white text-lg">No hay encuestas disponibles en este momento.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {encuestas.map((encuesta) => (
                            <div
                                key={encuesta.id}
                                className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl"
                            >
                                <div className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-100">
                                    <h2 className="text-2xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                                        {encuesta.titulo}
                                    </h2>
                                    <p className="text-gray-700 text-base mt-2">{encuesta.descripcion}</p>

                                    {/* Mostrar las preguntas de la encuesta desde la tabla preguntas_encuesta */}
                                    <div className="mt-4">
                                        {encuesta.preguntas_encuesta.map((pregunta, index) => (
                                            <div key={index} className="mt-6">
                                                <h3 className="text-xl font-semibold text-gray-800">
                                                    {index + 1}. {pregunta.pregunta}
                                                </h3>

                                                {/* Opciones de respuesta */}
                                                <div className="mt-2 space-y-2">
                                                    {opcionesRespuesta.map((opcion, idx) => (
                                                        <div key={idx} className="flex items-center space-x-2">
                                                            <input
                                                                type="radio"
                                                                id={`pregunta_${pregunta.id}_opcion_${idx}`}
                                                                name={`pregunta_${pregunta.id}`}
                                                                value={opcion}
                                                                onChange={() => handleRespuestaChange(pregunta.id, opcion)}
                                                                checked={respuestas[pregunta.id] === opcion}
                                                                className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-0"
                                                            />
                                                            <label
                                                                htmlFor={`pregunta_${pregunta.id}_opcion_${idx}`}
                                                                className="text-gray-700"
                                                            >
                                                                {opcion}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Botón de enviar encuesta */}
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={() => enviarEncuesta(encuesta.id)} // Aquí pasamos la encuesta.id
                                            disabled={
                                                !todasRespondidas(encuesta.preguntas_encuesta) || encuestasRespondidas[encuesta.id]
                                            }
                                            className={`px-4 py-2 text-white font-bold rounded-lg ${
                                                todasRespondidas(encuesta.preguntas_encuesta) && !encuestasRespondidas[encuesta.id]
                                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                                    : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                            {encuestasRespondidas[encuesta.id]
                                                ? "Encuesta Respondida"
                                                : todasRespondidas(encuesta.preguntas_encuesta)
                                                ? "Contestar encuesta"
                                                : "Responde todas las preguntas"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
