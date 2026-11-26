<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongsToUser; // Ensure you created this trait from the previous step

class TaskType extends Model
{
    use HasUuids, SoftDeletes, BelongsToUser;

    protected $fillable = [
        'name',
        'color',
        // 'user_id' is handled automatically by BelongsToUser
    ];

    // A TaskType has many Tasks
    public function tasks()
    {
        return $this->hasMany(Task::class, 'task_type_id');
    }
}