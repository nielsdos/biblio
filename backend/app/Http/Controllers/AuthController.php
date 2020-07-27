<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\User;
use App\UserInvite;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller {
    use AuthenticatesUsers;

    public function __construct() {
        $this->middleware('guest')->except(['user', 'logout', 'register']);
        $this->middleware('auth:sanctum')->only(['user']);
        $this->middleware('throttle:6,1')->only('register');
    }

    private function userInfo(User $user) {
        return response()->json([
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
        ]);
    }

    protected function authenticated(Request $request, User $user) {
        return $this->userInfo($user);
    }

    protected function loggedOut(Request $request) {
        return response()->json([]);
    }

    public function loginPage(Request $request) {
        return redirect()->away(config('app.url') . '/login');
    }

    public function user(Request $request) {
        return $this->userInfo($request->user());
    }

    public function register(RegisterRequest $request) {
        $fields = $request->validated();

        $invite = UserInvite::where('email', $fields['email'])->first();
        if(!$invite // Invite must exist
            || Carbon::parse($invite->created_at)->addHours(config('auth.user_invite_timeout'))->isPast() // Token expired
            || !Hash::check($fields['token'], $invite->token) // Token must correspond
        ) {
            $response = response()->json(['errors' => ['general' => [__('auth.token_invalid')]]], 422);
        } else {
            User::create([
                'first_name' => $fields['first_name'],
                'last_name' => $fields['last_name'],
                'email' => $fields['email'],
                'password' => Hash::make($fields['password']),
                'email_verified_at' => Carbon::now(),
            ]);
            $invite->delete();
            $response = response()->json([], 200);
        }

        return $response;
    }
}
