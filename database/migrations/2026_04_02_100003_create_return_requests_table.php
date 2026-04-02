<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('return_requests')) {
            Schema::create('return_requests', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('order_id')->constrained()->cascadeOnDelete();
                $table->foreignId('order_item_id')->nullable()->constrained()->nullOnDelete();
                $table->enum('type', ['return', 'warranty'])->default('return');
                $table->enum('status', ['pending', 'approved', 'rejected', 'in_process', 'completed'])->default('pending');
                $table->text('reason');
                $table->text('admin_notes')->nullable();
                $table->string('tracking_number')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('return_requests');
    }
};
