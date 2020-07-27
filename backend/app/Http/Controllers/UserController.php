<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\User;

class UserController extends Controller {
    use SearchTrait;

    public function __construct() {
        $this->authorizeResource(User::class, 'user');
    }

    protected function getSearchModel() {
        return User::class;
    }

    protected function getSearchResource() {
        return UserResource::class;
    }
}
