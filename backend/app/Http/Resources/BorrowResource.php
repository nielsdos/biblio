<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;
use Illuminate\Http\Resources\MissingValue;
use Illuminate\Support\Facades\Gate;

class BorrowResource extends JsonResource {
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

        return [
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'start' => Carbon::parse($this->pivot->start),
            'end' => Carbon::parse($this->pivot->end),
            'returned' => $this->pivot->returned,
            'late' => !$this->pivot->returned && Carbon::parse($this->pivot->end)->isPast(),
        ];
    }
}
