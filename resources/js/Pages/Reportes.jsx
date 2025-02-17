import { useState } from "react";
import { router } from "@inertiajs/react";
import {route} from "ziggy-js";

const Reportes = () => {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const generarReporte = (tipo) => {
        if (!fechaInicio || !fechaFin) {
            alert("Selecciona un rango de fechas");
            return;
        }

        let routeName = tipo === "top" ? "reportes.top" : tipo === "categoria" ? "reportes.categoria" : "reportes.solicitudes";

        const url = route(routeName, { fecha_inicio: fechaInicio, fecha_fin: fechaFin });
        window.open(url, "_blank");
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Generar Reportes en PDF</h2>

            <div className="mb-4">
                <label className="block text-lg text-gray-600 font-medium mb-2">Fecha de inicio:</label>
                <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="mb-6">
                <label className="block text-lg text-gray-600 font-medium mb-2">Fecha de fin:</label>
                <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={() => generarReporte("top")}
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    📊 Generar Top 5 Mejor Calificados
                </button>
                <button
                    onClick={() => generarReporte("categoria")}
                    className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    📑 Generar Recursos por Categoría
                </button>

                <button
                    onClick={() => generarReporte("solicitudes")}
                    className="w-full md:w-auto px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                    📑 Generar Solicitudes por Usuario
                </button>
            </div>
        </div>
    );
};

export default Reportes;
