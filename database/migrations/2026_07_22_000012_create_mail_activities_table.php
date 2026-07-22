<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mail_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('mail_thread_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('mail_draft_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('mail_account_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action', 64);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['mail_account_id', 'created_at']);
            $table->index(['mail_thread_id', 'created_at']);
            $table->index(['actor_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mail_activities');
    }
};
