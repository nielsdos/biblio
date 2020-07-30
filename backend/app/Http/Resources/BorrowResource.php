<?php

namespace App\Http\Resources;

class BorrowResource extends BaseBorrowResource {
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request) {
        return array_merge(['borrow' => parent::toArray($request)], [
            'book' => [
                'id' => $this->id,
                'title' => $this->title,
                'isbn10' => $this->isbn10,
                'isbn13' => $this->isbn13,
            ],
        ]);
    }
}
