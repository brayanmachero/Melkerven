<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mail_threads', function (Blueprint $table) {
            $table->softDeletes();
            $table->index(['deleted_at', 'last_message_at']);
        });
    }

    public function down(): void
    {
        Schema::table('mail_threads', function (Blueprint $table) {
            $table->dropIndex(['deleted_at', 'last_message_at']);
            $table->dropSoftDeletes();
        });
    }
};
