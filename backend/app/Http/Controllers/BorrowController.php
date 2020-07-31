<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Borrow;
use App\Borrower;
use App\Http\Resources\BorrowResource;

// TODO: apply policies where needed
class BorrowController extends Controller {
    public function indexByBorrower(Borrower $borrower) {
        $this->authorize('viewAny', Borrow::class);

        return BorrowResource::collection(
            $borrower->currentBorrows()
                     ->orderBy('start')
                     ->get(['books.id', 'title', 'isbn13', 'isbn10'])
        );
    }
}
