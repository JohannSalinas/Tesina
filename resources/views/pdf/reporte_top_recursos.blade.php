<!DOCTYPE html>
<html>
<head>
    <title>Top 5 Mejor Calificados</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 24px;
            color: #2c3e50;
            margin: 0;
        }
        .header h2 {
            font-size: 18px;
            color: #34495e;
            margin: 5px 0 0;
        }
        .header p {
            font-size: 14px;
            color: #7f8c8d;
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
        }
        th {
            background-color: #3498db;
            color: #ffffff;
            font-weight: bold;
            text-transform: uppercase;
        }
        td {
            border-bottom: 1px solid #dddddd;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>PLATAFORMA PARA RECURSOS EDUCATIVOS ABIERTOS PARA DOCENTES</h1>
        <h2>Top 5 Mejor Calificados</h2>
        <p>Fecha: {{ $fechaInicio }} - {{ $fechaFin }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Recurso</th>
                <th>Calificación</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($recursos as $index => $recurso)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $recurso->titulo }}</td>
                <td>{{ $recurso->calificacion }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Generado el: {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>
</body>
</html>