<!DOCTYPE html>
<html>
<head>
    <title>Top 5 Mejor Calificados</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid black; padding: 10px; text-align: left; }
        th { background-color: #f4f4f4; }
    </style>
</head>
<body>
    <h2>Top 5 Mejor Calificados ({{ $fechaInicio }} - {{ $fechaFin }})</h2>
    <table>
        <tr>
            <th>#</th>
            <th>Recurso</th>
            <th>Calificación</th>
        </tr>
        @foreach ($recursos as $index => $recurso)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $recurso->titulo }}</td>
            <td>{{ $recurso->calificacion }}</td>
        </tr>
        @endforeach
    </table>
</body>
</html>
