<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mail_accounts', function (Blueprint $table) {
            $table->string('history_import_status', 20)->default('idle')->index();
            $table->json('history_import_folders')->nullable();
            $table->unsignedSmallInteger('history_import_folder_index')->default(0);
            $table->unsignedInteger('history_import_page')->default(1);
            $table->unsignedInteger('history_imported_messages')->default(0);
            $table->unsignedInteger('history_imported_attachments')->default(0);
            $table->timestamp('history_import_started_at')->nullable();
            $table->timestamp('history_import_completed_at')->nullable();
            $table->text('history_import_error')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('mail_accounts', function (Blueprint $table) {
            $table->dropIndex(['history_import_status']);
            $table->dropColumn([
                'history_import_status',
                'history_import_folders',
                'history_import_folder_index',
                'history_import_page',
                'history_imported_messages',
                'history_imported_attachments',
                'history_import_started_at',
                'history_import_completed_at',
                'history_import_error',
            ]);
        });
    }
};
