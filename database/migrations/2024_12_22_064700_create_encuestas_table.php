<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEncuestasTable extends Migration
{
    public function up()
    {
        Schema::create('encuestas', function (Blueprint $table) {
            $table->id(); // Crea un campo id auto incremental
            $table->string('titulo'); // Titulo de la encuesta
            $table->text('descripcion')->nullable(); // Descripción de la encuesta
            $table->text('preguntas'); // Preguntas de la encuesta en formato texto
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Relación con la tabla users
            $table->timestamps(); // Crea los campos created_at y updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('encuestas');
    }
}
