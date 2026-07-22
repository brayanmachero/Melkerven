<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mail_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mail_thread_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sent_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('direction', 16)->index();
            $table->string('provider_id')->nullable()->unique();
            $table->string('provider_message_id')->nullable()->index();
            $table->string('in_reply_to')->nullable()->index();
            $table->string('from_address');
            $table->string('from_name')->nullable();
            $table->json('to_addresses');
            $table->json('cc_addresses')->nullable();
            $table->json('bcc_addresses')->nullable();
            $table->text('text_body')->nullable();
            $table->longText('html_body')->nullable();
            $table->json('attachments')->nullable();
            $table->boolean('is_read')->default(false)->index();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->timestamps();

            $table->index(['mail_thread_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mail_messages');
    }
};
