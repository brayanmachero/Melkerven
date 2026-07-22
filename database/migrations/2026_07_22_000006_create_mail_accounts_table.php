<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mail_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('address')->unique();
            $table->string('display_name')->nullable();
            $table->string('provider')->default('self-hosted');
            $table->string('incoming_host')->nullable();
            $table->unsignedSmallInteger('incoming_port')->default(993);
            $table->string('incoming_protocol', 16)->default('imap');
            $table->string('incoming_encryption', 16)->default('ssl');
            $table->boolean('incoming_validate_certificate')->default(true);
            $table->string('incoming_username')->nullable();
            $table->text('incoming_password')->nullable();
            $table->string('outbound_transport', 32)->default('resend');
            $table->boolean('is_shared')->default(false);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamp('last_synced_at')->nullable();
            $table->text('last_sync_error')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mail_accounts');
    }
};
