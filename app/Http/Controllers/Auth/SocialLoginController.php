<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialLoginController extends Controller
{
    public function redirect(string $provider): RedirectResponse
    {
        if (!in_array($provider, ['google', 'microsoft'])) {
            abort(404);
        }

        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider): RedirectResponse
    {
        if (!in_array($provider, ['google', 'microsoft'])) {
            abort(404);
        }

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors(['email' => 'Error al autenticar con ' . ucfirst($provider) . '. Intenta de nuevo.']);
        }

        $user = User::where('email', $socialUser->getEmail())->first();

        if ($user) {
            Auth::login($user, true);
            return redirect()->intended(route('dashboard'));
        }

        // Create new user from social login
        $user = User::create([
            'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'Usuario',
            'email' => $socialUser->getEmail(),
            'password' => Hash::make(Str::random(24)),
            'email_verified_at' => now(),
        ]);

        Auth::login($user, true);

        return redirect()->intended(route('dashboard'));
    }
}
