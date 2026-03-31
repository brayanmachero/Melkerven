<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $unreadMessages = 0;
        if ($request->user()?->isAdmin()) {
            $unreadMessages = \App\Models\ContactMessage::where('status', 'unread')->count();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'cart_count' => count(session()->get('cart', [])),
            'unread_messages' => $unreadMessages,
            'flash' => [
                'success' => session()->get('success'),
                'error' => session()->get('error'),
            ],
        ];
    }
}
