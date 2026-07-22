<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mail_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mail_message_id')->constrained()->cascadeOnDelete();
            $table->string('provider_attachment_id')->nullable();
            $table->string('filename');
            $table->string('content_type', 160)->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->string('content_disposition', 32)->nullable();
            $table->string('content_id')->nullable();
            $table->string('storage_disk', 64)->default('local');
            $table->string('storage_path')->nullable();
            $table->string('checksum', 64)->nullable();
            $table->timestamp('downloaded_at')->nullable();
            $table->timestamps();

            $table->unique(['mail_message_id', 'provider_attachment_id']);
            $table->index(['mail_message_id', 'content_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mail_attachments');
    }
};
