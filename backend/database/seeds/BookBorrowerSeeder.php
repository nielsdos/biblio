<?php

use Illuminate\Database\Seeder;
use App\BookBorrower;
use Carbon\Carbon;

class BookBorrowerSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        BookBorrower::create([
            'book_id' => 2,
            'borrower_id' => 1,
            'start' => Carbon::now()->addDays(-1),
            'end' => Carbon::now()->addDays(9),
        ]);
        BookBorrower::create([
            'book_id' => 2,
            'borrower_id' => 2,
            'start' => Carbon::now()->addDays(-2),
            'end' => Carbon::now()->addDays(8),
            'returned' => Carbon::now()->addDays(-1),
        ]);
        BookBorrower::create([
            'book_id' => 2,
            'borrower_id' => 1,
            'start' => Carbon::now()->addDays(-25),
            'end' => Carbon::now()->addDays(-15),
            'returned' => Carbon::now()->addDays(-13),
        ]);
        BookBorrower::create([
            'book_id' => 1,
            'borrower_id' => 2,
            'start' => Carbon::now()->addDays(-3),
            'end' => Carbon::now()->addDays(7),
        ]);
        BookBorrower::create([
            'book_id' => 1,
            'borrower_id' => 1,
            'start' => Carbon::now()->addDays(-10),
            'end' => Carbon::now()->addDays(10),
        ]);
        BookBorrower::create([
            'book_id' => 4,
            'borrower_id' => 1,
            'start' => Carbon::now()->addDays(-10),
            'end' => Carbon::now()->addDays(-5),
        ]);
    }
}
