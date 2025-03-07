<?php

namespace App\Http\Controllers;

use App\Models\NotificacionUnirseGrupo;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\RecursoEducativo;
use App\Models\RespuestasEncuesta;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;


class ReporteController extends Controller
{
    public function index()
    {
        return Inertia::render('Reportes');
    }

    // Validar que la fecha de inicio sea menor que la fecha de fin
    private function validarFechas($fechaInicio, $fechaFin)
    {
        if ($fechaInicio > $fechaFin) {

        }
        return null;
    }

    // Generar reporte de los Top 5 mejor calificados
    public function topRecursos(Request $request)
    {
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');

        // Validar fechas
        $validacion = $this->validarFechas($fechaInicio, $fechaFin);
        if ($validacion) {
            return $validacion;
        }

        $recursos = RecursoEducativo::whereBetween('created_at', [$fechaInicio, $fechaFin])
            ->orderByDesc('calificacion')
            ->limit(5)
            ->get();

        $pdf = Pdf::loadView('pdf.reporte_top_recursos', compact('recursos', 'fechaInicio', 'fechaFin'));

        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->output();
        }, 'Top_5_Mejor_Calificados.pdf');
    }

    // Generar reporte de recursos por categorías (grupos)
    public function recursosPorCategoria(Request $request)
    {
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');

        // Validar fechas
        $validacion = $this->validarFechas($fechaInicio, $fechaFin);
        if ($validacion) {
            return $validacion;
        }

        // Obtener los recursos
        $recursos = RecursoEducativo::whereBetween('created_at', [$fechaInicio, $fechaFin])
            ->selectRaw('tipo, COUNT(*) as total')
            ->groupBy('tipo')
            ->get();

        // Preparar datos para la gráfica
        $categorias = $recursos->pluck('tipo')->toArray();
        $totales = $recursos->pluck('total')->toArray();

        // Construir la URL de la gráfica usando image-charts
        $chartUrl = $this->generarGrafica($categorias, $totales);

        // Descargar la imagen y guardarla temporalmente
        $imageContent = file_get_contents($chartUrl);
        $imageName = 'grafica_' . time() . '.png'; // Nombre único para la imagen
        Storage::disk('public')->put($imageName, $imageContent);

        // Ruta de la imagen guardada
        $imagePath = storage_path('app/public/' . $imageName);

        // Pasar la ruta de la imagen a la vista
        $pdf = Pdf::loadView('pdf.reporte_recursos_categoria', compact('recursos', 'fechaInicio', 'fechaFin', 'imagePath'));

        return $pdf->download('Recursos_Por_Categoria.pdf');
    }

    private function generarGrafica($categorias, $totales)
    {
        // Convertir arrays a cadenas para la URL
        $labels = implode('|', $categorias);
        $data = implode(',', $totales);

        // Construir la URL de la gráfica
        $chartUrl = "https://image-charts.com/chart?cht=bvs&chd=t:$data&chl=$labels&chs=600x400&chco=4F81BD&chxt=x,y&chxl=0:|$labels&chxr=1,0," . max($totales);

        return $chartUrl;
    }

    public function recursosPorSolicitudes(Request $request)
    {
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');

        // Validar fechas
        $validacion = $this->validarFechas($fechaInicio, $fechaFin);
        if ($validacion) {
            return $validacion;
        }

        $solicitudes = NotificacionUnirseGrupo::whereBetween('created_at', [$fechaInicio, $fechaFin])
            ->get();

        $pdf = Pdf::loadView('pdf.reporte_recursos_solicitudes', compact('solicitudes', 'fechaInicio', 'fechaFin'));

        return $pdf->download('Recursos_Por_Solicitudes.pdf');
    }

    // Agrega esta función a tu controlador ReporteController
    public function indicadoresEncuesta(Request $request)
{
    $fechaInicio = $request->input('fecha_inicio');
    $fechaFin = $request->input('fecha_fin');

    // Validar fechas
    $validacion = $this->validarFechas($fechaInicio, $fechaFin);
    if ($validacion) {
        return $validacion;
    }

    // Consulta para contar las respuestas por encuesta y tipo de respuesta
    $respuestas = RespuestasEncuesta::whereBetween('respuestas_encuesta.created_at', [$fechaInicio, $fechaFin])
        ->join('preguntas_encuesta', 'respuestas_encuesta.pregunta_id', '=', 'preguntas_encuesta.id')
        ->select(
            'preguntas_encuesta.encuesta_id',
            'respuestas_encuesta.respuesta',
            DB::raw('count(*) as total')
        )
        ->groupBy('preguntas_encuesta.encuesta_id', 'respuestas_encuesta.respuesta')
        ->get();

    // Organizar los datos por encuesta
    $encuestas = [];
    foreach ($respuestas as $respuesta) {
        $encuestaId = $respuesta->encuesta_id;
        if (!isset($encuestas[$encuestaId])) {
            $encuestas[$encuestaId] = [
                'Totalmente de acuerdo' => 0,
                'De acuerdo' => 0,
                'Neutral' => 0,
                'En desacuerdo' => 0,
                'Totalmente en desacuerdo' => 0,
            ];
        }
        $encuestas[$encuestaId][$respuesta->respuesta] = $respuesta->total;
    }

    // Generar el PDF
    $pdf = Pdf::loadView('pdf.reporte_indicadores_encuesta', compact('encuestas', 'fechaInicio', 'fechaFin'));

    return $pdf->download('Indicadores_Encuesta_Aplicada.pdf');
}


}
