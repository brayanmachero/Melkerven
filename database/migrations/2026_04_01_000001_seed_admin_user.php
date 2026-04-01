<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

return new class extends Migration
{
    public function up(): void
    {
        User::updateOrCreate(
            ['email' => 'lsulca@melkerven.net'],
            [
                'name' => 'Lisbeth Sulca Torres',
                'password' => Hash::make('Melkerven2026!'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'tvargas@melkerven.net'],
            [
                'name' => 'Teodoro Vargas Solorzano',
                'password' => Hash::make('Melkerven2026!'),
                'role' => 'admin',
            ]
        );
    }

    public function down(): void
    {
        User::whereIn('email', ['lsulca@melkerven.net', 'tvargas@melkerven.net'])->delete();
    }
};
