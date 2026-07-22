<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MailAttachment extends Model
{
    protected $fillable = [
        'mail_message_id',
        'provider_attachment_id',
        'filename',
        'content_type',
        'size',
        'content_disposition',
        'content_id',
        'storage_disk',
        'storage_path',
        'checksum',
        'downloaded_at',
    ];

    protected $appends = [
        'download_url',
        'preview_url',
        'is_previewable',
    ];

    protected function casts(): array
    {
        return [
            'downloaded_at' => 'datetime',
        ];
    }

    public function message(): BelongsTo
    {
        return $this->belongsTo(MailMessage::class, 'mail_message_id');
    }

    public function getIsPreviewableAttribute(): bool
    {
        return filled($this->storage_path) && str_starts_with((string) $this->content_type, 'image/');
    }

    public function getDownloadUrlAttribute(): ?string
    {
        return $this->storage_path
            ? route('admin.mail.attachments.download', $this, false)
            : null;
    }

    public function getPreviewUrlAttribute(): ?string
    {
        return $this->is_previewable
            ? route('admin.mail.attachments.inline', $this, false)
            : null;
    }
}
