<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class MailAccountMembership extends Pivot
{
    protected function casts(): array
    {
        return [
            'can_send' => 'boolean',
            'can_manage' => 'boolean',
        ];
    }
}
