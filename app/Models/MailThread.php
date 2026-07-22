<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MailThread extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'subject',
        'mailbox',
        'mail_account_id',
        'participant_name',
        'participant_email',
        'status',
        'assigned_to',
        'last_direction',
        'last_preview',
        'last_message_at',
        'archived_at',
        'deleted_at',
    ];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
            'archived_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function messages(): HasMany
    {
        return $this->hasMany(MailMessage::class);
    }

    public function mailAccount(): BelongsTo
    {
        return $this->belongsTo(MailAccount::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
