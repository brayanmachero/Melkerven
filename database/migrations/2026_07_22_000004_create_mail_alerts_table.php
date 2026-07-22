<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mail_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('mail_thread_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('mail_message_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('type', 64)->default('mail.received');
            $table->string('title');
            $table->text('body')->nullable();
            $table->string('url')->nullable();
            $table->timestamp('read_at')->nullable()->index();
            $table->timestamps();

            $table->unique(['user_id', 'mail_message_id']);
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mail_alerts');
    }
};
