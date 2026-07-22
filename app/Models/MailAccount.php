<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MailAccount extends Model
{
    protected $hidden = [
        'incoming_password',
    ];

    protected $fillable = [
        'address',
        'display_name',
        'provider',
        'incoming_host',
        'incoming_port',
        'incoming_protocol',
        'incoming_encryption',
        'incoming_validate_certificate',
        'incoming_username',
        'incoming_password',
        'outbound_transport',
        'is_shared',
        'is_active',
        'last_synced_at',
        'last_sync_error',
    ];

    protected function casts(): array
    {
        return [
            'incoming_password' => 'encrypted',
            'incoming_port' => 'integer',
            'incoming_validate_certificate' => 'boolean',
            'is_shared' => 'boolean',
            'is_active' => 'boolean',
            'last_synced_at' => 'datetime',
        ];
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->using(MailAccountMembership::class)
            ->withPivot(['access_role', 'can_send', 'can_manage'])
            ->withTimestamps();
    }

    public function threads(): HasMany
    {
        return $this->hasMany(MailThread::class);
    }

    public function hasIncomingConfiguration(): bool
    {
        return filled($this->incoming_host)
            && filled($this->incoming_username)
            && filled($this->incoming_password);
    }

    public function usesImap(): bool
    {
        return $this->provider !== 'resend' && $this->hasIncomingConfiguration();
    }

    public function receivesThroughResend(): bool
    {
        return $this->provider === 'resend';
    }
}
