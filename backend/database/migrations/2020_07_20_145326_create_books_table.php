<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateBooksTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('books', function (Blueprint $table) {
            $table->bigIncrements('id');
            // For convenience for searching & caching, we store both.
            // A computed column would still be stored on disk anyway.
            $table->char('isbn13', 13);
            $table->char('isbn10', 10)->nullable();
            $table->enum('data_source', ['openlibrary']);
            $table->string('title');
            $table->unsignedBigInteger('publisher_id');
            $table->foreign('publisher_id')->references('id')->on('publishers');
            $table->smallInteger('publish_year');
            $table->tinyInteger('publish_month')->nullable();
            $table->tinyInteger('publish_day')->nullable();
            $table->string('cover_url')->nullable();
            $table->string('description')->nullable();
            $table->unsignedInteger('number_of_copies')->default(0);
            $table->timestamps();
        });

        DB::statement('ALTER TABLE books ADD FULLTEXT fulltext_idx (title, isbn13, isbn10)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('books');
    }
}
