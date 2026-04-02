<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Send abandoned cart reminders every hour
Schedule::command('cart:send-abandoned-emails')->hourly();

// Check low stock and email admins daily at 9am
Schedule::command('stock:check-low')->dailyAt('09:00');

// Notify users when products are back in stock every 30 min
Schedule::command('stock:notify-available')->everyThirtyMinutes();
