<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\TwoFactorCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class TwoFactorController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/TwoFactor');
    }

    public function verify(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        $user = $request->user();

        if (!$user->two_factor_code || now()->gt($user->two_factor_expires_at)) {
            return back()->withErrors(['code' => 'El código ha expirado. Se ha enviado uno nuevo.']);
        }

        if ($request->code !== $user->two_factor_code) {
            return back()->withErrors(['code' => 'El código ingresado es incorrecto.']);
        }

        // Mark as verified in session
        session(['two_factor_verified' => true]);

        // Clear the code
        $user->resetTwoFactorCode();

        return redirect()->intended(route('dashboard'));
    }

    public function resend(Request $request)
    {
        $request->user()->generateTwoFactorCode();

        return back()->with('status', 'Se ha enviado un nuevo código a tu email.');
    }
}
