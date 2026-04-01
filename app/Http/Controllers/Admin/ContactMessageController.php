<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Mail\ContactReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    public function index()
    {
        $messages = ContactMessage::orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
        ]);
    }

    public function show(ContactMessage $message)
    {
        if ($message->status === 'unread') {
            $message->update(['status' => 'read']);
        }

        return Inertia::render('Admin/Messages/Show', [
            'message' => $message,
        ]);
    }

    public function reply(Request $request, ContactMessage $message)
    {
        $validated = $request->validate([
            'admin_reply' => 'required|string|max:5000',
        ]);

        $message->update([
            'admin_reply' => $validated['admin_reply'],
            'status' => 'replied',
        ]);

        try {
            Mail::to($message->email)->send(new ContactReply($message));
        } catch (\Exception $e) {
            logger()->error('Error enviando respuesta de contacto: ' . $e->getMessage());
        }

        return back()->with('success', 'Respuesta enviada correctamente.');
    }
}
