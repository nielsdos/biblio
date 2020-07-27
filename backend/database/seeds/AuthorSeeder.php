<?php

use Illuminate\Database\Seeder;
use App\Author;

class AuthorSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Author::create([
            'name' => 'J.K. Rowling',
        ]);
        Author::create([
            'name' => 'Douglas Adam',
        ]);
        Author::create([
            'name' => 'George Orwell',
        ]);
    }
}
