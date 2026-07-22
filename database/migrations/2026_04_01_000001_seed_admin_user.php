<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        $initialPassword = env('MELKERVEN_INITIAL_ADMIN_PASSWORD');

        // Fresh installations may opt in to bootstrap these accounts. Existing
        // installations keep their current credentials and never receive a
        // password from source control.
        if (! is_string($initialPassword) || $initialPassword === '') {
            return;
        }

        foreach ([
            ['email' => 'lsulca@melkerven.net', 'name' => 'Lisbeth Sulca Torres'],
            ['email' => 'tvargas@melkerven.net', 'name' => 'Teodoro Vargas Solorzano'],
        ] as $admin) {
            User::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => Hash::make($initialPassword),
                    'role' => 'admin',
                ]
            );
        }
    }

    public function down(): void
    {
        // User accounts are business data and must never be deleted by a rollback.
    }
};
