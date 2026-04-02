<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DteController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dte/Index', [
            'status' => 'pending_integration',
            'message' => 'La integración con el SII está preparada pero requiere credenciales de acceso al portal del Servicio de Impuestos Internos.',
        ]);
    }
}
