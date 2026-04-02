<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TwoFactorMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->isAdmin() && $user->two_factor_enabled && !session('two_factor_verified')) {
            // If code not sent yet for this session, generate and send
            if (!$user->two_factor_code || now()->gt($user->two_factor_expires_at)) {
                $user->generateTwoFactorCode();
            }

            // Allow access to 2FA verification page and logout
            if ($request->routeIs('two-factor.*') || $request->routeIs('logout')) {
                return $next($request);
            }

            return redirect()->route('two-factor.index');
        }

        return $next($request);
    }
}
