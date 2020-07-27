<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class UserInvite extends Model {
    use SearchTrait;

    protected $guarded = [];
    protected $searchable = ['email'];
    protected $sortable = ['email', 'created_at'];
    public $timestamps = false;

    public function creator() {
        return $this->hasOne('App\User', 'id', 'creator_user_id');
    }

    protected function prepareSearchQuery(Builder $query): Builder {
        $expiredAt = Carbon::now()->subHours(config('auth.user_invite_timeout'));
        return $query->with('creator')->where('created_at', '>=', $expiredAt);
    }
}
