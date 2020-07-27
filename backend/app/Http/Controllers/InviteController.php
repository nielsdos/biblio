<?php

namespace App\Http\Controllers;

use App\Http\Requests\InviteRequest;
use App\Http\Resources\UserInviteResource;
use App\UserInvite;
use App\Notifications\UserInvite as UserInviteNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Hash;

// TODO: delete expired invites
class InviteController extends Controller {
    use SearchTrait;

    public function __construct() {
        $this->authorizeResource(UserInvite::class, 'userInvite');
    }

    protected function getSearchModel() {
        return UserInvite::class;
    }

    protected function getSearchResource() {
        return UserInviteResource::class;
    }

    public function inviteForm(Request $request) {
        return redirect()->away(config('app.url') . '/invite?email=' . urlencode($request->query('email')) . '&token=' . urlencode($request->query('token')));
    }

    public function create(InviteRequest $request) {
        $data = $request->validated();

        $key = config('app.key');
        if(Str::startsWith($key, 'base64:')) {
            $key = base64_decode(substr($key, 7));
        }

        $token = hash_hmac('sha256', Str::random(40), $key);

        UserInvite::where('email', $data['email'])->delete();
        UserInvite::create([
            'email' => $data['email'],
            'token' => Hash::make($token),
            'creator_user_id' => Auth::id(),
        ]);

        Notification::route('mail', $request->input('email'))->notify(new UserInviteNotification($data['email'], $token));

        return response()->json([]);
    }

    public function destroy(UserInvite $userInvite) {
        $userInvite->delete();
        return response()->noContent();
    }
}
