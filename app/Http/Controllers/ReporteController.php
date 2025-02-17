<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\RecursoEducativo; 
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Response;

class ReporteController extends Controller
{
    
    public function index()
    {
        return Inertia::render('Reportes');
    }
    
    
    // Generar reporte de los Top 5 mejor calificados
    public function topRecursos(Request $request)
    {
        $fechaInicio = $request->input('fecha_inicio');
    $fechaFin = $request->input('fecha_fin');

    $recursos = RecursoEducativo::whereBetween('created_at', [$fechaInicio, $fechaFin])
        ->orderByDesc('calificacion')
        ->limit(5)
        ->get();

    $pdf = Pdf::loadView('pdf.reporte_top_recursos', compact('recursos', 'fechaInicio', 'fechaFin'));

    return Response::make($pdf->output(), 200, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'inline; filename="Top_5_Mejor_Calificados.pdf"',
    ]);
    }

    // Generar reporte de recursos por categorías (grupos)
    public function recursosPorCategoria(Request $request)
    {
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');

        $recursos = RecursoEducativo::whereBetween('created_at', [$fechaInicio, $fechaFin])
            ->selectRaw('tipo, COUNT(*) as total')
            ->groupBy('tipo')
            ->get();

        $pdf = Pdf::loadView('pdf.reporte_recursos_categoria', compact('recursos', 'fechaInicio', 'fechaFin'));

        return $pdf->download('Recursos_Por_Categoria.pdf');
    }
}
