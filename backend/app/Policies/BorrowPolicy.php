<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

// TODO: Currently there are no roles.
class BorrowPolicy {
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any borrow.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function viewAny(User $user) {
        return true;
    }
}
