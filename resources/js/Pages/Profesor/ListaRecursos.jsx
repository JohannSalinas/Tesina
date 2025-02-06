import React, { useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

const ListaRecursos = ({ grupos }) => {
    const [calificacion, setCalificacion] = useState({});

    // Función para manejar la calificación
    const handleCalificar = async (recursoId, nuevaCalificacion) => {
        try {
            setCalificacion((prev) => ({
                ...prev,
                [recursoId]: nuevaCalificacion,
            }));

            await axios.post(route('recursos.calificar', recursoId), {
                calificacion: nuevaCalificacion,
            });
        } catch (error) {
            console.error('Error al calificar el recurso:', error);
        }
    };

    // Generar documentos compatibles con DocViewer
    const getFileDocs = (recurso) => {
        if (!recurso || !recurso.archivo_path) return [];
        return [{ uri: `/storage/${recurso.archivo_path}` }];
    };


    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-gray-700 mb-4 text-center">
                    Recursos Educativos de Mis Grupos
                </h1>

                {grupos.length > 0 ? (
                    grupos.map((grupo) => (
                        <div key={grupo.id} className="bg-gray-50 p-4 rounded-lg shadow-md mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">{grupo.nombre}</h2>
                            <p className="text-gray-600">{grupo.descripcion}</p>

                            {grupo.recursos.length > 0 ? (
                                <ul className="mt-3 space-y-4">
                                    {grupo.recursos.map((recurso) => (
                                        <li key={recurso.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                            <div className="mb-2">
                                                <span className="font-semibold text-lg">{recurso.titulo}</span>
                                            </div>

                                            <p className="text-gray-600 mb-2">{recurso.descripcion}</p>

                                            {/* Vista previa del archivo con react-doc-viewer */}
                                            {recurso.archivo_path && (
                                                <DocViewer
                                                    pluginRenderers={DocViewerRenderers}
                                                    documents={getFileDocs(recurso)}
                                                    style={{ width: "100%", height: "300px" }}
                                                />
                                            )}

                                            {/* Calificación */}
                                            <div className="flex items-center mt-3">
                                                <span className="font-semibold">Calificación: </span>
                                                <div className="ml-2 flex items-center">
                                                    {[...Array(5)].map((_, index) => {
                                                        const rating = calificacion[recurso.id] ?? recurso.calificacion;
                                                        return (
                                                            <button
                                                                key={index}
                                                                onClick={() => handleCalificar(recurso.id, index + 1)}
                                                                className={`${
                                                                    rating >= index + 1 ? 'text-yellow-500' : 'text-gray-300'
                                                                } text-xl`}
                                                            >
                                                                ★
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 mt-2">No hay recursos en este grupo.</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No estás inscrito en ningún grupo.</p>
                )}

                <div className="text-center mt-6">
                    <Link href={route('dashboard')} className="text-blue-600 hover:underline">
                        &larr; Volver al Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ListaRecursos;
