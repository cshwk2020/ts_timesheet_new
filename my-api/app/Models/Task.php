<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongsToUser;

class Task extends Model
{
    use HasUuids, SoftDeletes, BelongsToUser;

    protected $fillable = [
        'from_datetime',
        'to_datetime',
        'from_timestamp',
        'to_timestamp',
        'task_details',
        'task_type_id',
        'status',
        // 'user_id' is handled automatically by BelongsToUser
    ];

    protected $casts = [
        'from_datetime' => 'datetime',
        'to_datetime' => 'datetime',
        'from_timestamp' => 'integer',
        'to_timestamp' => 'integer',
    ];

    // A Task belongs to a TaskType
    public function taskType()
    {
        return $this->belongsTo(TaskType::class, 'task_type_id');
    }
}