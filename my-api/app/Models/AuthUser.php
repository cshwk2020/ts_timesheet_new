<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable; // Allows using auth() helpers

class AuthUser extends Authenticatable
{
    use SoftDeletes;

    protected $table = 'auth_user_table';
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id', 'username', 'password_hash', 'jwt_ttl_hours'
    ];

    protected $hidden = ['password_hash'];

    // Map Laravel's password field to our custom hash field
    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}