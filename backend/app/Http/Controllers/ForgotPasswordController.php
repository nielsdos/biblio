<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Support\Facades\Notification;
use App\Http\Controllers\Controller;
use App\Notifications\ResetPasswordAccountNotFound;

class ForgotPasswordController extends Controller {
    use SendsPasswordResetEmails;

    public function __construct() {
        $this->middleware('guest');
        $this->middleware('throttle:10,10');
    }

    protected function sendResetLinkResponse(Request $request, $response) {
        return response([], 200);
    }

    protected function sendResetLinkFailedResponse(Request $request, $response) {
        Notification::route('mail', $request->input('email'))->notify(new ResetPasswordAccountNotFound);
        return response([], 200);
    }

    public function resetForm(Request $request) {
        return redirect()->away(config('app.url') . '/reset?email=' . urlencode($request->query('email')) . '&token=' . urlencode($request->query('token')));
    }
}
