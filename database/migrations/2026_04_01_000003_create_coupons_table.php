<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('coupons')) {
            Schema::create('coupons', function (Blueprint $table) {
                $table->id();
                $table->string('code')->unique();
                $table->enum('type', ['percentage', 'fixed']);
                $table->decimal('value', 10, 2);
                $table->decimal('min_amount', 10, 2)->nullable();
                $table->integer('max_uses')->nullable();
                $table->integer('used_count')->default(0);
                $table->date('expires_at')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasColumn('orders', 'coupon_code')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->string('coupon_code')->nullable()->after('total_amount');
                $table->decimal('discount', 10, 2)->default(0)->after('coupon_code');
            });
        }
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['coupon_code', 'discount']);
        });
        Schema::dropIfExists('coupons');
    }
};
