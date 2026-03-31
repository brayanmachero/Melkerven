<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('status')->default('pending'); // pending, paid, failed, shipped
            $table->string('document_type')->default('boleta'); // boleta, factura

            // Amounts
            $table->decimal('net_amount', 12, 2);
            $table->decimal('tax_amount', 12, 2); // IVA 19%
            $table->decimal('shipping_amount', 12, 2);
            $table->decimal('total_amount', 12, 2);

            // Customer Info (Personal)
            $table->string('customer_name');
            $table->string('customer_rut');
            $table->string('customer_email');
            $table->string('customer_phone');

            // Shipping Details
            $table->foreignId('shipping_rate_id')->constrained('shipping_rates');
            $table->string('shipping_commune');
            $table->text('shipping_address');

            // Business Info (Only for Factura)
            $table->string('business_name')->nullable();
            $table->string('business_rut')->nullable();
            $table->string('business_giro')->nullable();
            $table->string('business_address')->nullable();

            // Webpay Integration
            $table->string('buy_order')->unique();
            $table->string('webpay_token')->nullable();
            $table->string('payment_id')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
