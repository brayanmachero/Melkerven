<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mail_account_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mail_account_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('access_role', 32)->default('member');
            $table->boolean('can_send')->default(true);
            $table->boolean('can_manage')->default(false);
            $table->timestamps();

            $table->unique(['mail_account_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mail_account_user');
    }
};
