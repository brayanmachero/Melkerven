<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderStatusUpdated;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('user')->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', $search)
                  ->orWhere('customer_email', 'like', $search)
                  ->orWhere('buy_order', 'like', $search);
            });
        }

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['items', 'user']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,paid,failed,shipped,delivered'
        ]);

        $oldStatus = $order->status;
        $order->update(['status' => $request->status]);

        \App\Models\ActivityLog::log('order.status_changed', "Pedido #{$order->id} cambió de {$oldStatus} a {$request->status}", $order, ['old' => $oldStatus, 'new' => $request->status]);

        if ($oldStatus !== $request->status) {
            try {
                Mail::to($order->customer_email)->send(new OrderStatusUpdated($order));
            } catch (\Exception $e) {
                logger()->error('Error enviando correo de estado de orden: ' . $e->getMessage());
            }
        }

        return back()->with('success', 'Estado del pedido actualizado correctamente.');
    }

    public function export()
    {
        $headers = [
            "Content-type" => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=pedidos_melkerven_" . date('Y_m_d_H_i') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $columns = [
            'ID',
            'Fecha',
            'Cliente',
            'Email',
            'Telefono',
            'RUT',
            'Direccion',
            'Comuna',
            'Region',
            'Tipo Doc',
            'Neto',
            'IVA',
            'Envio',
            'Total',
            'Estado'
        ];

        $callback = function () use ($columns) {
            $file = fopen('php://output', 'w');
            fputs($file, chr(0xEF) . chr(0xBB) . chr(0xBF)); // UTF-8 BOM
            fputcsv($file, $columns, ';');

            $orders = Order::orderBy('created_at', 'desc')->get();

            foreach ($orders as $order) {
                fputcsv($file, [
                    '#ORD-' . $order->id,
                    $order->created_at->format('d/m/Y H:i'),
                    $order->customer_name,
                    $order->customer_email,
                    $order->customer_phone,
                    $order->customer_rut,
                    $order->shipping_address,
                    $order->shipping_commune,
                    $order->shipping_region_id,
                    strtoupper($order->document_type),
                    $order->net_amount,
                    $order->tax_amount,
                    $order->shipping_amount,
                    $order->total_amount,
                    strtoupper($order->status),
                ], ';');
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
