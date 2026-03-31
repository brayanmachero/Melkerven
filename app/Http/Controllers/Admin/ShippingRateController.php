<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingRate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShippingRateController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Shipping/Index', [
            'shippingRates' => ShippingRate::all()
        ]);
    }

    public function update(Request $request, ShippingRate $shippingRate)
    {
        $validated = $request->validate([
            'base_cost' => 'required|numeric|min:0',
            'estimated_days' => 'required|integer|min:0',
            'allow_shipping' => 'required|boolean',
        ]);

        $shippingRate->update($validated);

        return redirect()->back()->with('success', 'Configuración de envío actualizada.');
    }
}
