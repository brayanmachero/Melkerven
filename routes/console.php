<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Send abandoned cart reminders every hour
Schedule::command('cart:send-abandoned-emails')->hourly();

// Send low stock alerts daily at 9am
Schedule::command('stock:alert-low')->dailyAt('09:00');
