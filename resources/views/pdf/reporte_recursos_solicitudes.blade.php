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
        <th>Usuario Solicitante</th>
        <th>Creador De Grupo</th>
        <th>Id Del Grupo</th>
        <th>Estatus</th>

    </tr>
    @foreach ($solicitudes as $index => $solicitud)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $solicitud->id_usuario_solicitante }}</td>
            <td>{{ $solicitud->id_usuario_creador_grupo }}</td>
            <td>{{ $solicitud->id_grupo }}</td>
            <td>{{ $solicitud->estatus }}</td>
        </tr>
    @endforeach
</table>
</body>
</html>
