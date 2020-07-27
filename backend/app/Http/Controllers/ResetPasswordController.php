<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ResetsPasswords;

class ResetPasswordController extends Controller {
    use ResetsPasswords;

    protected function sendResetFailedResponse(Request $request, $response) {
        return response()->json(['errors' => ['general' => [trans($response)]]], 422);
    }

    protected function sendResetResponse(Request $request, $response) {
        return response()->json([], 200);
    }
}
