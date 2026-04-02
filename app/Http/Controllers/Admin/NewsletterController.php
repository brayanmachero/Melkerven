<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class NewsletterController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Newsletter/Index', [
            'subscribers' => Subscriber::orderByDesc('created_at')->paginate(20),
            'stats' => [
                'total' => Subscriber::count(),
                'active' => Subscriber::where('is_active', true)->count(),
                'unsubscribed' => Subscriber::where('is_active', false)->count(),
            ],
        ]);
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $subscribers = Subscriber::where('is_active', true)->get();
        $sent = 0;

        foreach ($subscribers as $subscriber) {
            try {
                Mail::send('emails.newsletter', [
                    'emailContent' => $validated['content'],
                    'unsubscribeUrl' => url("/newsletter/unsubscribe/{$subscriber->email}"),
                ], function ($message) use ($subscriber, $validated) {
                    $message->to($subscriber->email)
                        ->subject($validated['subject']);
                });
                $sent++;
            } catch (\Exception $e) {
                Log::error("Error enviando newsletter a {$subscriber->email}: " . $e->getMessage());
            }
        }

        return back()->with('success', "Newsletter enviado a {$sent} suscriptores.");
    }

    public function destroy(Subscriber $subscriber)
    {
        $subscriber->delete();
        return back()->with('success', 'Suscriptor eliminado.');
    }
}
