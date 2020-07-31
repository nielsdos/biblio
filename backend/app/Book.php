<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Book extends Model {
    use SearchTrait;

    protected $guarded = [];
    protected $searchable = ['title', 'isbn13', 'isbn10'];
    protected $sortable = [];

    public function currentBorrowers() {
        return $this->belongsToMany('App\Borrower')
                    ->withPivot('start', 'end', 'returned')
                    ->wherePivot('returned', '=', null);
    }

    public function authors() {
        return $this->belongsToMany('App\Author');
    }

    public function publisher() {
        return $this->belongsTo('App\Publisher');
    }
}
