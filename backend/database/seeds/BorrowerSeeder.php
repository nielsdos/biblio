<?php

use Illuminate\Database\Seeder;
use App\Borrower;

class BorrowerSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        Borrower::create([
            'first_name' => 'First',
            'last_name' => 'Person',
        ]);
        Borrower::create([
            'first_name' => 'Second',
            'last_name' => 'Person',
        ]);
    }
}
