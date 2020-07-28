<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookResource;
use App\Http\Requests\LookupISBNRequest;
use App\Http\Requests\CreateBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Resources\BookSuggestionResource;
use App\Publisher;
use App\Book;
use App\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookController extends Controller {
    public function __construct() {
        $this->authorizeResource(Book::class, 'book', ['except' => ['index', 'show']]);
    }

    public function index(Request $request) {
        $q = (string) $request->query('q');
        if($q === '') {
            return response()->json(['data' => []]);
        }

        return BookResource::collection(
            Book::with(['authors', 'publisher', 'borrowers'])
                ->search($q)
                ->limit(10)
                ->get()
        );
    }

    public function show(int $book) {
        return new BookResource(
            Book::with(['authors', 'publisher', 'borrowers'])
                ->findOrFail($book)
        );
    }

    public function suggest(Request $request) {
        $q = (string) $request->query('q');

        return BookSuggestionResource::collection(
            Book::search($q)->limit(10)->get()
        );
    }

    private function transformOpenLibraryResponse($data, string $isbn) {
        $data = current($data);
        $details = &$data->details;

        // The "covers" key doesn't always exist, but "thumbnail_url" does when a cover is available.
        // -S means "small" cover, so we can change that.
        if(isset($data->thumbnail_url) && /* be safe */ is_string($data->thumbnail_url)) {
            $cover = preg_replace('/-S\.jpg$/', '-M.jpg', $data->thumbnail_url);
        } else {
            $cover = null;
        }

        // Description is either directly accessible as a string, or it is tagged
        // with a type.
        $description = null;
        if(isset($details->description)) {
            $descriptionObject = $details->description;

            if(is_string($descriptionObject)) {
                $description = $descriptionObject;
            } elseif(is_object($descriptionObject)
                && isset($descriptionObject->value)
                && is_string($descriptionObject->value)) {
                $description = $descriptionObject->value;
            }
        }

        // Publisher
        $publisher = null;
        if(isset($details->publishers)
            && is_array($details->publishers)
            && count($details->publishers) > 0) {
            $publisherObject = $details->publishers[0];

            if(is_string($publisherObject)) {
                $publisher = $publisherObject;
            } elseif(is_object($publisherObject)
                && isset($publisherObject->name)
                && is_string($publisherObject->name)) {
                $publisher = $publisherObject->name;
            }
        }

        // Authors, guaranteed format
        $authors = array_map(function($value) {
            return $value->name;
        }, $details->authors);

        // Handle the undefined date format
        $parts = explode('-', str_replace(' ', '-', $details->publish_date));
        $year = (int) ($parts[0] ?? 0);
        $month = (int) ($parts[1] ?? 0);
        $day = (int) ($parts[2] ?? 0);
        if($month === 0) $month = null;
        if($day === 0) $day = null;

        if(strlen($isbn) === 10) {
            $isbn10 = $isbn;
            $isbn13 = isbn13_from_isbn10($isbn);
        } else {
            $isbn10 = isbn10_from_isbn13($isbn);
            $isbn13 = $isbn;
        }

        return [
            'data_source' => 'openlibrary',
            'title' => $details->title,
            'description' => $description,
            'publisher' => $publisher,
            'publish_year' => $year,
            'publish_month' => $month,
            'publish_day' => $day,
            'authors' => $authors,
            'cover_url' => $cover,
            'isbn13' => $isbn13,
            'isbn10' => $isbn10,
        ];
    }

    private function getDataFromOpenLibrary(string $isbn) {
        $client = new \GuzzleHttp\Client();
        $res = $client->get('https://openlibrary.org/api/books', [
            'query' => [
                'format' => 'json',
                'jscmd' => 'details',
                'bibkeys' => 'ISBN:' . $isbn,
            ],
        ]);

        $res = (string) $res->getBody();
        if($res === '{}') {
            return null;
        }

        $res = json_decode($res);
        return $this->transformOpenLibraryResponse($res, $isbn);
    }

    public function lookup(LookupISBNRequest $request) {
        $this->authorize('create', Book::class);
        $fields = $request->validated();

        try {
            if($res = $this->getDataFromOpenLibrary($fields['isbn'])) {
                return response()->json($res);
            } else {
                return response()->json(['errors' => ['isbn' => [__('books.isbn_not_found')]]], 404);
            }
        } catch(\Exception $e) {
            return response()->json([], 500);
        }
    }

    public function create(CreateBookRequest $request) {
        $fields = $request->validated();

        try {
            $data = $this->getDataFromOpenLibrary($fields['isbn']);
            if(!$data) {
                throw new \Exception();
            }
        } catch(\Exception $e) {
            return response()->json([], 500);
        }

        DB::transaction(function() use($data, $fields) {
            Book::create([
                'isbn13' => $data['isbn13'],
                'isbn10' => $data['isbn10'],
                'data_source' => 'openlibrary',
                'title' => $data['title'],
                'description' => $data['description'],
                'cover_url' => $data['cover_url'],
                'number_of_copies' => $fields['number_of_copies'],
                'publish_year' => $data['publish_year'],
                'publish_month' => $data['publish_month'],
                'publish_day' => $data['publish_day'],
                'publisher_id' => Publisher::firstOrCreate(['name' => $data['publisher']])->id,
            ])->authors()->attach(array_map(function($value) {
                return Author::firstOrCreate(['name' => $value])->id;
            }, $data['authors']));
        });

        return response()->json([], 201);
    }

    public function update(UpdateBookRequest $request, Book $book) {
        // TODO: In the future, we would need the option to change the data source if requested
        // or to sync, but not now.
        $fields = $request->validated();

        $book->number_of_copies = $fields['number_of_copies'];
        $book->save();

        return response()->noContent();
    }

    public function destroy(Book $book) {
        $book->delete();
        return response()->noContent();
    }
}
