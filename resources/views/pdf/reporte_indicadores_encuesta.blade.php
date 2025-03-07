<!DOCTYPE html>
<html>
<head>
    <title>Indicadores de la Encuesta Aplicada</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        h1 {
            text-align: center;
            color: #4F46E5;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }
        th {
            background-color: #f2f2f2;
        }
        .encuesta {
            margin-bottom: 30px;
        }
        .encuesta h2 {
            color: #4F46E5;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <h1>Indicadores de la Encuesta Aplicada</h1>
    <p><strong>Fecha de inicio:</strong> {{ $fechaInicio }}</p>
    <p><strong>Fecha de fin:</strong> {{ $fechaFin }}</p>

    @foreach ($encuestas as $encuestaId => $respuestas)
        <div class="encuesta">
            <h2>Encuesta: {{ $encuestaId }}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Respuesta</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($respuestas as $respuesta => $total)
                        <tr>
                            <td>{{ $respuesta }}</td>
                            <td>{{ $total }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endforeach
</body>
</html>