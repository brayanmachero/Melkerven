<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mail_threads', function (Blueprint $table) {
            $table->foreignId('mail_account_id')
                ->nullable()
                ->after('mailbox')
                ->constrained('mail_accounts')
                ->nullOnDelete()
                ->index();
        });
    }

    public function down(): void
    {
        Schema::table('mail_threads', function (Blueprint $table) {
            $table->dropConstrainedForeignId('mail_account_id');
        });
    }
};
