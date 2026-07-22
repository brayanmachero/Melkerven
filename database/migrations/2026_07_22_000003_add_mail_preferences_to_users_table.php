<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->longText('mail_signature_html')->nullable()->after('two_factor_enabled');
            $table->text('mail_signature_text')->nullable()->after('mail_signature_html');
            $table->boolean('mail_in_app_notifications')->default(true)->after('mail_signature_text');
            $table->boolean('mail_desktop_notifications')->default(false)->after('mail_in_app_notifications');
            $table->boolean('mail_sound_notifications')->default(false)->after('mail_desktop_notifications');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'mail_signature_html',
                'mail_signature_text',
                'mail_in_app_notifications',
                'mail_desktop_notifications',
                'mail_sound_notifications',
            ]);
        });
    }
};
