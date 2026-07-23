<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mail_messages', function (Blueprint $table) {
            $table->string('source_folder')->nullable()->after('provider_message_id');
            $table->string('source_folder_type', 20)->nullable()->after('source_folder')->index();
        });
    }

    public function down(): void
    {
        Schema::table('mail_messages', function (Blueprint $table) {
            $table->dropIndex(['source_folder_type']);
            $table->dropColumn(['source_folder', 'source_folder_type']);
        });
    }
};
