<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Borrower extends Model {
    use SearchTrait;

    protected $fillable = ['first_name', 'last_name'];
    protected $searchable = ['first_name', 'last_name'];
    protected $sortable = ['first_name', 'last_name', 'created_at'];

    public function currentBorrows() {
        return $this->belongsToMany('App\Book')
                    ->withPivot(['start', 'end', 'returned'])
                    ->where('returned', '=', null)
                    ->using(Borrow::class);
    }
}
