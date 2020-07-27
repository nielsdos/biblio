<?php

namespace App\Policies;

use App\Borrower;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

// TODO: Currently there are no roles.
class BorrowerPolicy {
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any borrowers.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function viewAny(User $user) {
        return true;
    }

    /**
     * Determine whether the user can view the borrower.
     *
     * @param  \App\User  $user
     * @param  \App\Borrower  $borrower
     * @return mixed
     */
    public function view(User $user, Borrower $borrower) {
        return true;
    }

    /**
     * Determine whether the user can create borrowers.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user) {
        return true;
    }

    /**
     * Determine whether the user can update the borrower.
     *
     * @param  \App\User  $user
     * @param  \App\Borrower  $borrower
     * @return mixed
     */
    public function update(User $user, Borrower $borrower) {
        return true;
    }

    /**
     * Determine whether the user can delete the borrower.
     *
     * @param  \App\User  $user
     * @param  \App\Borrower  $borrower
     * @return mixed
     */
    public function delete(User $user, Borrower $borrower) {
        return false;
    }

    /**
     * Determine whether the user can restore the borrower.
     *
     * @param  \App\User  $user
     * @param  \App\Borrower  $borrower
     * @return mixed
     */
    public function restore(User $user, Borrower $borrower) {
        return $this->delete($user, $borrower);
    }

    /**
     * Determine whether the user can permanently delete the borrower.
     *
     * @param  \App\User  $user
     * @param  \App\Borrower  $borrower
     * @return mixed
     */
    public function forceDelete(User $user, Borrower $borrower) {
        return $this->delete($user, $borrower);
    }
}
