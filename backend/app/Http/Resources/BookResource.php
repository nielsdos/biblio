<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;
use Illuminate\Support\Facades\Gate;

class BookResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request) {
        $borrowersCount = $this->currentBorrowers->count();
        $data = [
            'id' => $this->id,
            'available' => $this->number_of_copies - $borrowersCount,
            'number_of_copies' => $this->number_of_copies,
            'data_source' => $this->data_source,
            'publish_year' => $this->publish_year,
            'publish_month' => $this->publish_month,
            'publish_day' => $this->publish_day,
            'cover_url' => $this->cover_url,
            'title' => $this->title,
            'description' => $this->description,
            'authors' => NamedResource::collection($this->authors),
            'publisher' => new NamedResource($this->publisher),
            'borrows' => EmbeddedBorrowResource::collection($this->currentBorrowers),
            'isbn13' => $this->isbn13,
            'isbn10' => $this->when($this->isbn10, $this->isbn10),
            // Permission stuff
            'can_update' => Gate::allows('update', $this->resource),
            'can_delete' => Gate::allows('delete', $this->resource),
        ];

        if($borrowersCount > 0) {
            $firstAvailable = Carbon::parse($this->currentBorrowers[0]->pivot->end);
            foreach($this->currentBorrowers as $borrower) {
                $date = Carbon::parse($borrower->pivot->end);
                if($date->lt($firstAvailable)) {
                    $firstAvailable = $date;
                }
            }
            $data['first_available'] = $firstAvailable;
        }

        return $data;
    }
}
