<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mail_draft_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mail_draft_id')->constrained()->cascadeOnDelete();
            $table->string('filename');
            $table->string('content_type', 160)->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->string('storage_disk', 64)->default('local');
            $table->string('storage_path');
            $table->string('checksum', 64)->nullable();
            $table->timestamps();

            $table->index(['mail_draft_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mail_draft_attachments');
    }
};
