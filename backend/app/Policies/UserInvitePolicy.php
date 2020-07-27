<?php

namespace App\Policies;

use App\User;
use App\UserInvite;
use Illuminate\Auth\Access\HandlesAuthorization;

// TODO: Currently there are no roles.
class UserInvitePolicy {
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any user invites.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function viewAny(User $user) {
        return true;
    }

    /**
     * Determine whether the user can view the user invite.
     *
     * @param  \App\User  $user
     * @param  \App\UserInvite  $userInvite
     * @return mixed
     */
    public function view(User $user, UserInvite $userInvite) {
        return false;
    }

    /**
     * Determine whether the user can create user invites.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user) {
        return true;
    }

    /**
     * Determine whether the user can update the user invite.
     *
     * @param  \App\User  $user
     * @param  \App\UserInvite  $userInvite
     * @return mixed
     */
    public function update(User $user, UserInvite $userInvite) {
        return false;
    }

    /**
     * Determine whether the user can delete the user invite.
     *
     * @param  \App\User  $user
     * @param  \App\UserInvite  $userInvite
     * @return mixed
     */
    public function delete(User $user, UserInvite $userInvite) {
        return true;
    }

    /**
     * Determine whether the user can restore the user invite.
     *
     * @param  \App\User  $user
     * @param  \App\UserInvite  $userInvite
     * @return mixed
     */
    public function restore(User $user, UserInvite $userInvite) {
        return $this->delete($user, $userInvite);
    }

    /**
     * Determine whether the user can permanently delete the user invite.
     *
     * @param  \App\User  $user
     * @param  \App\UserInvite  $userInvite
     * @return mixed
     */
    public function forceDelete(User $user, UserInvite $userInvite) {
        return $this->delete($user, $userInvite);
    }
}
