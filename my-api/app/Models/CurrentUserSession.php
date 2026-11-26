<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CurrentUserSession extends Model
{
    use SoftDeletes;

    protected $table = 'current_user_session';
    protected $primaryKey = 'auth_session_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'auth_session_id', 'user_id', 'logon_datetime', 
        'expire_datetime', 'user_agent', 'ip'
    ];
    
    protected $casts = [
        'logon_datetime' => 'datetime',
        'expire_datetime' => 'datetime',
    ];
}