<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MailActivity extends Model
{
    protected $fillable = [
        'actor_id',
        'mail_thread_id',
        'mail_draft_id',
        'mail_account_id',
        'action',
        'metadata',
    ];

    protected function casts(): array
    {
        return ['metadata' => 'array'];
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function thread(): BelongsTo
    {
        return $this->belongsTo(MailThread::class, 'mail_thread_id')->withTrashed();
    }

    public function draft(): BelongsTo
    {
        return $this->belongsTo(MailDraft::class, 'mail_draft_id');
    }

    public function mailAccount(): BelongsTo
    {
        return $this->belongsTo(MailAccount::class);
    }
}
