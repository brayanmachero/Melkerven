<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MailDraft extends Model
{
    protected $fillable = [
        'user_id',
        'mail_account_id',
        'to_address',
        'subject',
        'body',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function mailAccount(): BelongsTo
    {
        return $this->belongsTo(MailAccount::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(MailDraftAttachment::class);
    }
}
