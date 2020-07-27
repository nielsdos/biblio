<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class BookResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request) {
        $borrowersCount = $this->borrowers->count();
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
            'borrows' => BorrowResource::collection($this->borrowers),
            'isbn13' => $this->isbn13,
            'isbn10' => $this->when($this->isbn10, $this->isbn10),
        ];

        if($borrowersCount > 0) {
            $firstAvailable = Carbon::parse($this->borrowers[0]->pivot->end);
            foreach($this->borrowers as $borrower) {
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
