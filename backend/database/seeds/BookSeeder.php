<?php

use Illuminate\Database\Seeder;
use App\Book;

class BookSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        // Source: openlibrary

        Book::create([
            'isbn13' => '9780545010221',
            'isbn10' => '0545010225',
            'data_source' => 'openlibrary',
            'title' => 'Harry Potter and the Deathly Hallows',
            'publish_year' => 2007,
            'publish_month' => 7,
            'publisher_id' => 3,
            'cover_url' => 'https://covers.openlibrary.org/b/id/7904782-M.jpg',
            'number_of_copies' => 2,
        ])->authors()->attach(1);

        Book::create([
            'isbn13' => '9780545582995',
            'isbn10' => '0545582997',
            'data_source' => 'openlibrary',
            'title' => 'Harry Potter and the Half-Blood Prince',
            'publish_year' => 2013,
            'publish_month' => 9,
            'publisher_id' => 4,
            'cover_url' => 'https://covers.openlibrary.org/b/id/8131350-M.jpg',
            'number_of_copies' => 2,
        ])->authors()->attach(1);

        Book::create([
            'isbn13' => '9780545582957',
            'isbn10' => '0545582954',
            'data_source' => 'openlibrary',
            'title' => 'Harry Potter and the Goblet of Fire',
            'publish_year' => 2013,
            'publish_month' => 9,
            'publisher_id' => 4,
            'cover_url' => 'https://covers.openlibrary.org/b/id/8081233-M.jpg',
            'number_of_copies' => 1,
        ])->authors()->attach(1);

        Book::create([
            'isbn13' => '9780545582933',
            'isbn10' => '0545582938',
            'data_source' => 'openlibrary',
            'title' => 'Harry Potter and the Prisoner of Azkaban',
            'publish_year' => 2013,
            'publish_month' => 9,
            'publisher_id' => 4,
            'cover_url' => 'https://covers.openlibrary.org/b/id/8128316-M.jpg',
            'description' => 'Some description I\'m probably not allowed to include in the demo data.',
            'number_of_copies' => 2,
        ])->authors()->attach(1);

        Book::create([
            'isbn13' => '9780345391803',
            'isbn10' => '0345391802',
            'data_source' => 'openlibrary',
            'title' => 'The Hitchhiker\'s Guide to the Galaxy',
            'publish_year' => 2005,
            'publisher_id' => 1,
            'cover_url' => 'https://covers.openlibrary.org/b/id/8774325-M.jpg',
            'number_of_copies' => 42,
        ])->authors()->attach(2);

        Book::create([
            'isbn13' => '9780452284234',
            'isbn10' => '0452284236',
            'data_source' => 'openlibrary',
            'title' => 'Nineteen eighty-four',
            'publish_year' => 2003,
            'publisher_id' => 2,
            'cover_url' => 'https://covers.openlibrary.org/b/id/7898938-M.jpg',
            'number_of_copies' => 2,
        ])->authors()->attach(3);
    }
}
