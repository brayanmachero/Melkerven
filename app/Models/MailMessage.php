<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MailMessage extends Model
{
    protected $fillable = [
        'mail_thread_id',
        'sent_by',
        'direction',
        'provider_id',
        'provider_message_id',
        'in_reply_to',
        'from_address',
        'from_name',
        'to_addresses',
        'cc_addresses',
        'bcc_addresses',
        'text_body',
        'html_body',
        'attachments',
        'is_read',
        'sent_at',
        'received_at',
    ];

    protected function casts(): array
    {
        return [
            'to_addresses' => 'array',
            'cc_addresses' => 'array',
            'bcc_addresses' => 'array',
            'attachments' => 'array',
            'is_read' => 'boolean',
            'sent_at' => 'datetime',
            'received_at' => 'datetime',
        ];
    }

    public function thread(): BelongsTo
    {
        return $this->belongsTo(MailThread::class, 'mail_thread_id')->withTrashed();
    }

    public function sentBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sent_by');
    }

    public function files(): HasMany
    {
        return $this->hasMany(MailAttachment::class);
    }
}
