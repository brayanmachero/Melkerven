<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $subscriber = Subscriber::where('email', $request->email)->first();

        if ($subscriber) {
            if ($subscriber->is_active) {
                return back()->with('success', '¡Ya estás suscrito a nuestro newsletter!');
            }
            $subscriber->update(['is_active' => true, 'unsubscribed_at' => null]);
            return back()->with('success', '¡Te has re-suscrito exitosamente!');
        }

        Subscriber::create([
            'email' => $request->email,
            'name' => $request->name,
        ]);

        return back()->with('success', '¡Gracias por suscribirte a nuestro newsletter!');
    }

    public function unsubscribe(Request $request, $email)
    {
        $subscriber = Subscriber::where('email', $email)->first();

        if ($subscriber) {
            $subscriber->update(['is_active' => false, 'unsubscribed_at' => now()]);
        }

        return inertia('Newsletter/Unsubscribed');
    }
}
