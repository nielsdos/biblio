<?php

use Illuminate\Database\Seeder;
use App\Publisher;

class PublisherSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Publisher::create([
            'name' => 'Del Rey Books',
        ]);
        Publisher::create([
            'name' => 'Plume',
        ]);
        Publisher::create([
            'name' => 'Arthur A. Levine Books',
        ]);
        Publisher::create([
            'name' => 'Scholastic',
        ]);
    }
}
