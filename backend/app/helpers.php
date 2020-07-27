<?php

/**
 * Get an ISBN10 from an ISBN13 if possible.
 *
 * @param string $isbn13
 * @return null|string false if failed, string containing ISBN10 if success
 */
function isbn10_from_isbn13(string $isbn13) {
    // Calculate the ISBN 10 if it exists.
    if(strncmp($isbn13, '978', 3) === 0) {
        $isbn10 = substr($isbn13, 3, 9); // without the check digit, we'll calculate that next
        $sum = 0;
        for($i = 0; $i < 9; ++$i) {
            $sum += ($i + 1) * (int) $isbn10[$i];
        }
        $sum %= 11;
        if($sum === 10) {
            $isbn10 .= 'X';
        } else {
            $isbn10 .= $sum;
        }
        return $isbn10;
    }

    return null;
}

/**
 * Get an ISBN13 from an ISBN10.
 *
 * @param string $isbn10
 * @return string string containing ISBN13
 */
function isbn13_from_isbn10(string $isbn10) {
    $isbn13 = '978' . substr($isbn10, 0, 9);
    $sum = 0;
    for($i = 0; $i < 12; ++$i) {
        $sum += (1 + 2 * ($i & 1)) * (int) $isbn13[$i];
    }
    if($sum === 0) {
        $isbn13 .= '0';
    } else {
        $isbn13 .= 10 - ($sum % 10);
    }
    return $isbn13;
}

/**
 * Cleanup query boolean language mode parameter
 *
 * @param string $input Input search parameter
 * @return string
 */
function cleanupBooleanModeParameter(string $input): string {
    // Filter operators so the query succeeds.
    // If we want to allow the operators, we would need to parse the input.
    $input = str_replace(['@', '(', ')', '+', '-', '<', '>', '"', '~'], '', $input);
    $input = preg_replace('/\*+/', '\1', $input);
    return $input;
}
