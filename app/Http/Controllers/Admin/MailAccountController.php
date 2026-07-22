<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MailAccount;
use App\Models\User;
use App\Services\MailboxImapClientFactory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class MailAccountController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Mail/Accounts', [
            'accounts' => MailAccount::query()
                ->with(['users:id,name,email'])
                ->orderBy('address')
                ->get(),
            'users' => User::query()
                ->where('role', 'admin')
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        if ($data['incoming_source'] === 'imap' && blank($data['incoming_password'] ?? null)) {
            throw ValidationException::withMessages([
                'incoming_password' => 'La contraseña IMAP es obligatoria al crear un buzón.',
            ]);
        }

        $account = DB::transaction(function () use ($data): MailAccount {
            $account = MailAccount::create($this->accountAttributes($data));
            $this->syncMembers($account, $data);

            return $account;
        });

        return redirect()
            ->route('admin.mail.accounts.index')
            ->with('success', $account->receivesThroughResend()
                ? "Buzón {$account->address} creado. Quedó preparado para recibir y enviar desde la bandeja web."
                : "Buzón {$account->address} creado. Prueba IMAP antes de sincronizarlo.");
    }

    public function update(Request $request, MailAccount $account): RedirectResponse
    {
        $data = $this->validated($request);

        DB::transaction(function () use ($account, $data): void {
            $account->update($this->accountAttributes($data, keepingExistingPassword: true));
            $this->syncMembers($account, $data);
        });

        return back()->with('success', "Configuración de {$account->address} actualizada.");
    }

    public function test(MailAccount $account, MailboxImapClientFactory $imap): RedirectResponse
    {
        if (! $account->usesImap()) {
            return back()->with('success', 'Este buzón usa recepción web con Resend; no necesita una prueba IMAP.');
        }

        try {
            $folders = $imap->test($account);
            $account->update(['last_sync_error' => null]);

            return back()->with('success', sprintf('IMAP conectado correctamente. Se detectaron %d carpetas.', count($folders)));
        } catch (Throwable $exception) {
            report($exception);
            $account->update(['last_sync_error' => $exception->getMessage()]);

            return back()->with('error', 'No fue posible conectar por IMAP. Revisa el servidor, TLS y las credenciales.');
        }
    }

    /** @return array<string, mixed> */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'address' => ['required', 'email:rfc', 'max:255'],
            'display_name' => ['nullable', 'string', 'max:120'],
            'incoming_source' => ['required', Rule::in(['resend', 'imap'])],
            'incoming_host' => ['nullable', 'required_if:incoming_source,imap', 'string', 'max:253', 'regex:/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i'],
            'incoming_port' => ['nullable', 'required_if:incoming_source,imap', 'integer', 'between:1,65535'],
            'incoming_encryption' => ['nullable', 'required_if:incoming_source,imap', Rule::in(['ssl', 'tls', 'starttls'])],
            'incoming_validate_certificate' => ['required', 'boolean'],
            'incoming_username' => ['nullable', 'required_if:incoming_source,imap', 'string', 'max:255'],
            'incoming_password' => ['nullable', 'string', 'max:1000'],
            'is_shared' => ['required', 'boolean'],
            'is_active' => ['required', 'boolean'],
            'member_ids' => ['required', 'array', 'min:1'],
            'member_ids.*' => ['integer', 'distinct', Rule::exists('users', 'id')->where('role', 'admin')],
            'manager_ids' => ['nullable', 'array'],
            'manager_ids.*' => ['integer', 'distinct', Rule::exists('users', 'id')->where('role', 'admin')],
        ]);

        if (array_diff($data['manager_ids'] ?? [], $data['member_ids'])) {
            throw ValidationException::withMessages([
                'manager_ids' => 'Los administradores del buzón deben pertenecer al buzón.',
            ]);
        }

        return $data;
    }

    /** @param array<string, mixed> $data */
    private function accountAttributes(array $data, bool $keepingExistingPassword = false): array
    {
        $usesImap = $data['incoming_source'] === 'imap';

        $attributes = [
            'address' => strtolower($data['address']),
            'display_name' => $data['display_name'] ?: null,
            'provider' => $usesImap ? 'imap' : 'resend',
            'incoming_host' => $usesImap ? strtolower((string) $data['incoming_host']) : null,
            'incoming_port' => $usesImap ? $data['incoming_port'] : 993,
            'incoming_protocol' => 'imap',
            'incoming_encryption' => $usesImap ? $data['incoming_encryption'] : 'ssl',
            'incoming_validate_certificate' => $data['incoming_validate_certificate'],
            'incoming_username' => $usesImap ? $data['incoming_username'] : null,
            'outbound_transport' => 'resend',
            'is_shared' => $data['is_shared'],
            'is_active' => $data['is_active'],
        ];

        if (! $usesImap) {
            $attributes['incoming_password'] = null;
        } elseif (! $keepingExistingPassword || filled($data['incoming_password'] ?? null)) {
            $attributes['incoming_password'] = $data['incoming_password'];
        }

        return $attributes;
    }

    /** @param array<string, mixed> $data */
    private function syncMembers(MailAccount $account, array $data): void
    {
        $managers = array_map('intval', $data['manager_ids'] ?? []);
        $members = [];

        foreach ($data['member_ids'] as $userId) {
            $isManager = in_array((int) $userId, $managers, true);
            $members[$userId] = [
                'access_role' => $isManager ? 'owner' : 'member',
                'can_send' => true,
                'can_manage' => $isManager,
            ];
        }

        $account->users()->sync($members);
    }
}
