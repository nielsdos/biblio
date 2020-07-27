<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ISBN implements Rule {
    private $type = 0;

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value) {
        $this->type = strlen($value);
        switch($this->type) {
            case 10:
                if(preg_match('/^\d+[xX]?$/', $value)) {
                    return $this->checkSum10($value);
                } else {
                    $this->type = -1;
                    return false;
                }
            case 13:
                if(preg_match('/^\d+$/', $value)) {
                    return $this->checkSum13($value);
                } else {
                    $this->type = -1;
                    return false;
                }
            default: return false;
        }
    }

    /**
     * Checksum for ISBN10
     *
     * @param string $value 
     * @return bool
     */
    private function checkSum10(string $value): bool {
        $sum = 0;
        for($i = 0; $i < 9; ++$i) {
            $sum += (10 - $i) * (int) $value[$i];
        }
        if(strtolower($value[9]) === 'x') {
            $sum += 10;
        } else {
            $sum += (int) $value[9];
        }
        return $sum % 11 === 0;
    }

    /**
     * Checksum for ISBN13
     *
     * @param string $value 
     * @return bool
     */
    private function checkSum13(string $value): bool {
        $sum = 0;
        for($i = 0; $i < 13; ++$i) {
            $sum += (1 + 2 * ($i & 1)) * (int) $value[$i];
        }
        return $sum % 10 === 0;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message() {
        return __($this->messageUntranslated());
    }

    /**
     * Get the validation error message (untranslated).
     *
     * @return string
     */
    public function messageUntranslated() {
        switch($this->type) {
            case 10: return 'validation.isbn10_invalid';
            case 13: return 'validation.isbn13_invalid';
            case -1: return 'validation.isbn_invalid_chars';
            default: return 'validation.isbn_invalid_length';
        }
    }
}
