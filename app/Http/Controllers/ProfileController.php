<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $sessions = [];
        if (config('session.driver') === 'database') {
            $sessions = \DB::table('sessions')
                ->where('user_id', $request->user()->id)
                ->orderByDesc('last_activity')
                ->get()
                ->map(function ($session) use ($request) {
                    $agent = new \Jenssegers\Agent\Agent();
                    return (object) [
                        'id' => $session->id,
                        'ip_address' => $session->ip_address,
                        'user_agent' => $session->user_agent,
                        'is_current' => $session->id === $request->session()->getId(),
                        'last_active' => \Carbon\Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
                    ];
                });
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'sessions' => $sessions,
        ]);
    }

    /**
     * Toggle two-factor authentication for the user.
     */
    public function toggleTwoFactor(Request $request): RedirectResponse
    {
        $user = $request->user();
        $user->two_factor_enabled = !$user->two_factor_enabled;
        $user->save();

        // Clear existing 2FA state
        if (!$user->two_factor_enabled) {
            $user->resetTwoFactorCode();
            session()->forget('two_factor_verified');
        }

        return Redirect::route('profile.edit')->with('status',
            $user->two_factor_enabled
                ? 'Autenticación de dos factores activada.'
                : 'Autenticación de dos factores desactivada.'
        );
    }

    /**
     * Invalidate other sessions.
     */
    public function destroyOtherSessions(Request $request): RedirectResponse
    {
        $request->validate(['password' => ['required', 'current_password']]);

        \DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->where('id', '!=', $request->session()->getId())
            ->delete();

        return Redirect::route('profile.edit')->with('status', 'Otras sesiones cerradas correctamente.');
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
