<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Borrower;
use App\Http\Resources\BorrowResource;

class BorrowController extends Controller {
    public function __construct() {
        // TODO
        //$this->authorizeResource(Borrower::class, 'borrower');
    }

    public function indexByBorrower(Borrower $borrower) {
// TODO: rename book_borrowers table? get rid of model?

        return BorrowResource::collection(
            $borrower->currentBorrows()->get(['books.id', 'title', 'isbn13', 'isbn10'])
        );
    }
}
