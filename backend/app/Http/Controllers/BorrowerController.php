<?php

namespace App\Http\Controllers;

use App\Http\Resources\BorrowerResource;
use App\Borrower;
use App\Http\Requests\CreateBorrowerRequest;
use App\Http\Resources\BorrowerSuggestionResource;
use Illuminate\Http\Request;

class BorrowerController extends Controller {
    use SearchTrait;

    public function __construct() {
        $this->authorizeResource(Borrower::class, 'borrower');
    }

    protected function getSearchModel() {
        return Borrower::class;
    }

    protected function getSearchResource() {
        return BorrowerResource::class;
    }

    public function create(CreateBorrowerRequest $request) {
        $data = $request->validated();

        Borrower::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
        ]);

        return response()->json([], 201);
    }

    public function suggest(Request $request) {
        $this->authorize('viewAny', Borrower::class);

        $q = (string) $request->query('q');

        return BorrowerSuggestionResource::collection(
            Borrower::search($q)->limit(10)->get(['id', 'first_name', 'last_name'])
        );
    }

    public function update(CreateBorrowerRequest $request, Borrower $borrower) {
        $data = $request->validated();

        $borrower->first_name = $data['first_name'];
        $borrower->last_name = $data['last_name'];
        $borrower->save();

        return response()->noContent();
    }
}
