<?php

namespace App\Http\Requests;

use App\Rules\ISBN;
use Illuminate\Foundation\Http\FormRequest;

class CreateBookRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'isbn' => ['required', 'unique:books,isbn13', 'unique:books,isbn10', new ISBN],
            'number_of_copies' => 'required|integer|min:1|max:99999',
        ];
    }
}
