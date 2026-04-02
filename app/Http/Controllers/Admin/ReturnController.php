<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReturnRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReturnController extends Controller
{
    public function index()
    {
        $returns = ReturnRequest::with(['user', 'order', 'orderItem'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('Admin/Returns/Index', [
            'returns' => $returns,
        ]);
    }

    public function updateStatus(Request $request, ReturnRequest $returnRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected,in_process,completed',
            'admin_notes' => 'nullable|string|max:2000',
            'tracking_number' => 'nullable|string|max:255',
        ]);

        $returnRequest->update($validated);

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'return_status_update',
            'description' => "Solicitud #{$returnRequest->id} actualizada a {$validated['status']}",
            'model_type' => 'ReturnRequest',
            'model_id' => $returnRequest->id,
        ]);

        return back()->with('success', 'Estado de solicitud actualizado.');
    }
}
