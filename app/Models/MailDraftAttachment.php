<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MailDraftAttachment extends Model
{
    protected $fillable = [
        'mail_draft_id',
        'filename',
        'content_type',
        'size',
        'storage_disk',
        'storage_path',
        'checksum',
    ];

    protected $appends = ['download_url'];

    public function draft(): BelongsTo
    {
        return $this->belongsTo(MailDraft::class, 'mail_draft_id');
    }

    public function getDownloadUrlAttribute(): string
    {
        return route('admin.mail.drafts.attachments.download', $this, false);
    }
}
