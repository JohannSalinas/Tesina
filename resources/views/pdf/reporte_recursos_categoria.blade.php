<!DOCTYPE html>
<html>
<head>
    <title>Recursos por Categoría</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid black; padding: 10px; text-align: left; }
        th { background-color: #f4f4f4; }
    </style>
</head>
<body>
    <h2>Recursos por Categoría ({{ $fechaInicio }} - {{ $fechaFin }})</h2>
    <table>
        <tr>
            <th>Categoría</th>
            <th>Total Recursos</th>
        </tr>
        @foreach ($recursos as $recurso)
        <tr>
            <td>{{ $recurso->categoria }}</td>
            <td>{{ $recurso->total }}</td>
        </tr>
        @endforeach
    </table>
</body>
</html>
