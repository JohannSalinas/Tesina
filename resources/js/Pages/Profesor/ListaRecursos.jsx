import React, { useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import Swal from 'sweetalert2';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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
        <AuthenticatedLayout>
            <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 py-10 px-6">
                <div className="max-w-5xl mx-auto bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold text-white text-center mb-6">Recursos Educativos de Mis Grupos</h1>

                    {grupos.length > 0 ? (
                        grupos.map((grupo) => (
                            <div key={grupo.id} className="bg-white/40 backdrop-blur-lg p-6 rounded-lg shadow-md mb-6 transition-transform transform hover:scale-105">
                                <h2 className="text-xl font-semibold text-gray-900">{grupo.nombre}</h2>
                                <p className="text-gray-700 mt-2">{grupo.descripcion}</p>

                                {grupo.recursos.length > 0 ? (
                                    <ul className="mt-4 space-y-6">
                                        {grupo.recursos.map((recurso) => (
                                            <li key={recurso.id} className="p-6 bg-white/50 backdrop-blur-md rounded-lg shadow-md border border-gray-200 transition-all hover:shadow-lg">
                                                <div className="mb-4">
                                                    <span className="font-semibold text-lg text-gray-800">{recurso.titulo}</span>
                                                </div>

                                                <p className="text-gray-600 mb-4">{recurso.descripcion}</p>

                                                {/* Vista previa del archivo con react-doc-viewer */}
{recurso.archivo_path && (
    <div className="overflow-hidden rounded-lg">
        <DocViewer
            pluginRenderers={DocViewerRenderers}
            documents={getFileDocs(recurso)}
            style={{
                width: "100%",
                height: "300px",
                maxHeight: "300px",  // Asegura que no se sobrepase la altura de la tarjeta
            }}
        />
    </div>
)}

                                                {/* Calificación */}
                                                <div className="flex items-center mt-4">
                                                    <span className="font-semibold text-gray-800">Calificación: </span>
                                                    <div className="ml-3 flex items-center">
                                                        {[...Array(5)].map((_, index) => {
                                                            const rating = calificacion[recurso.id] ?? recurso.calificacion;
                                                            return (
                                                                <button
                                                                    key={index}
                                                                    onClick={() => handleCalificar(recurso.id, index + 1)}
                                                                    className={`${
                                                                        rating >= index + 1 ? 'text-yellow-500' : 'text-gray-300'
                                                                    } text-2xl hover:text-yellow-400 transition-all`}
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
                        <p className="text-gray-200 text-center w-full">No estás inscrito en ningún grupo.</p>
                    )}

                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ListaRecursos;
