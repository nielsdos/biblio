<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\MissingValue;
use Illuminate\Support\Facades\Gate;

class EmbeddedBorrowResource extends BaseBorrowResource {
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request) {
        // More future-proof than doing this in `BookResource` for the whole collection at once.
        if(!Gate::allows('view', $this->resource))
            return new MissingValue;

        return array_merge(parent::toArray($request), [
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
        ]);
    }
}
