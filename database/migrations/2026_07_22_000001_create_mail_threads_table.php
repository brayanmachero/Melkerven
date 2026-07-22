<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mail_threads', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->string('mailbox')->nullable();
            $table->string('participant_name')->nullable();
            $table->string('participant_email')->nullable()->index();
            $table->string('status')->default('open')->index();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->string('last_direction', 16)->nullable();
            $table->text('last_preview')->nullable();
            $table->timestamp('last_message_at')->nullable()->index();
            $table->timestamp('archived_at')->nullable()->index();
            $table->timestamps();

            $table->index(['last_direction', 'archived_at', 'last_message_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mail_threads');
    }
};
