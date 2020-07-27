<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Book extends Model {
    protected $guarded = [];

    public function borrowers() {
        return $this->belongsToMany('App\Borrower', 'book_borrowers')
                    ->withPivot('start', 'end', 'returned')
                    ->wherePivot('returned', '=', null);
    }

    public function authors() {
        return $this->belongsToMany('App\Author');
    }

    public function publisher() {
        return $this->belongsTo('App\Publisher');
    }

    /**
     * Search
     *
     * @param Builder $query
     * @param string $term
     * @return Builder
     */
    public function scopeSearch(Builder $query, string $term): Builder {
        if($term !== '') {
            $term = cleanupBooleanModeParameter($term . '*');
            $query = $query->whereRaw("MATCH (title, isbn13, isbn10) AGAINST (? IN BOOLEAN MODE)", $term);
        }
        return $query;
    }
}
