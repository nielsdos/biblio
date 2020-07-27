<?php

namespace App\Http\Controllers;

use App\Http\Resources\BorrowerResource;
use App\Borrower;
use App\Http\Requests\CreateBorrowerRequest;

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

    public function update(CreateBorrowerRequest $request, Borrower $borrower) {
        $data = $request->validated();

        $borrower->first_name = $data['first_name'];
        $borrower->last_name = $data['last_name'];
        $borrower->save();

        return response()->noContent();
    }
}
