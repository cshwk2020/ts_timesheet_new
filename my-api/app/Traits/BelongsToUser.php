<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait BelongsToUser
{
    protected static function bootBelongsToUser()
    {
        // 1. Global scope: Only fetch rows for the logged-in user
        static::addGlobalScope('user_scope', function (Builder $builder) {
            if (auth()->hasUser()) {
                $builder->where('user_id', auth()->user()->user_id);
            }
        });

        // 2. Auto-fill user_id on create
        static::creating(function ($model) {
            if (auth()->hasUser()) {
                $model->user_id = auth()->user()->user_id;
            }
        });
    }
}

