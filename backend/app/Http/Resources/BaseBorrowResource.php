<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class BaseBorrowResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request) {
        return [
            'start' => Carbon::parse($this->pivot->start),
            'end' => Carbon::parse($this->pivot->end),
            'returned' => $this->pivot->returned,
            'late' => !$this->pivot->returned && Carbon::parse($this->pivot->end)->isPast(),
        ];
    }
}
