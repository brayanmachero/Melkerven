<?php

namespace Tests\Feature\Admin;

use App\Jobs\ImportMailboxHistory;
use App\Models\MailAccount;
use App\Models\MailThread;
use App\Models\User;
use App\Services\MailboxAccess;
use App\Services\MailboxImapClientFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class MailAccountTest extends TestCase
{
    use RefreshDatabase;

    public function test_imap_credentials_are_encrypted_and_the_connection_configuration_is_mapped(): void
    {
        $account = MailAccount::create([
            'address' => 'contacto@melkerven.test',
            'display_name' => 'Contacto Melkerven',
            'incoming_host' => 'mail.melkerven.test',
            'incoming_port' => 993,
            'incoming_protocol' => 'imap',
            'incoming_encryption' => 'ssl',
            'incoming_validate_certificate' => true,
            'incoming_username' => 'contacto@melkerven.test',
            'incoming_password' => 'imap-secret-for-test',
        ]);

        $this->assertNotSame('imap-secret-for-test', DB::table('mail_accounts')->value('incoming_password'));
        $this->assertSame('imap-secret-for-test', $account->fresh()->incoming_password);

        $configuration = app(MailboxImapClientFactory::class)->configuration($account->fresh());

        $this->assertSame('mail.melkerven.test', $configuration['host']);
        $this->assertSame(993, $configuration['port']);
        $this->assertSame('ssl', $configuration['encryption']);
        $this->assertTrue($configuration['validate_cert']);
        $this->assertSame('imap-secret-for-test', $configuration['password']);
    }

    public function test_a_shared_mailbox_can_grant_individual_access_and_own_threads(): void
    {
        $firstUser = User::factory()->create(['role' => 'admin']);
        $secondUser = User::factory()->create(['role' => 'admin']);
        $account = MailAccount::create([
            'address' => 'contacto@melkerven.test',
            'is_shared' => true,
        ]);

        $account->users()->attach($firstUser, [
            'access_role' => 'owner',
            'can_send' => true,
            'can_manage' => true,
        ]);
        $account->users()->attach($secondUser, [
            'access_role' => 'member',
            'can_send' => true,
            'can_manage' => false,
        ]);
        $thread = MailThread::create([
            'subject' => 'Solicitud de cotización',
            'mailbox' => $account->address,
            'mail_account_id' => $account->id,
            'participant_email' => 'cliente@example.test',
            'last_message_at' => now(),
        ]);

        $this->assertCount(2, $account->users);
        $this->assertTrue($firstUser->mailAccounts()->whereKey($account)->exists());
        $this->assertSame('owner', $firstUser->mailAccounts()->first()->pivot->access_role);
        $this->assertTrue($secondUser->mailAccounts()->first()->pivot->can_send);
        $this->assertSame($account->id, $thread->mailAccount->id);
    }

    public function test_a_mailbox_member_cannot_open_a_thread_from_another_mailbox(): void
    {
        $member = User::factory()->create(['role' => 'admin']);
        $account = MailAccount::create(['address' => 'privado@melkerven.test']);
        $otherAccount = MailAccount::create(['address' => 'otro@melkerven.test']);
        $account->users()->attach($member, ['can_send' => true]);
        $thread = MailThread::create([
            'subject' => 'Conversación privada',
            'mail_account_id' => $otherAccount->id,
            'participant_email' => 'cliente@example.test',
            'last_message_at' => now(),
        ]);

        $this->assertFalse(app(MailboxAccess::class)->canReadThread($member, $thread));
        $this->actingAs($member)->get(route('admin.mail.show', $thread))->assertForbidden();
    }

    public function test_an_admin_can_create_a_shared_imap_mailbox_with_encrypted_credentials(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $member = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post(route('admin.mail.accounts.store'), [
                'address' => 'contacto@melkerven.test',
                'display_name' => 'Equipo Melkerven',
                'incoming_source' => 'imap',
                'incoming_host' => 'mail.melkerven.test',
                'incoming_port' => 993,
                'incoming_encryption' => 'ssl',
                'incoming_validate_certificate' => true,
                'incoming_username' => 'contacto@melkerven.test',
                'incoming_password' => 'encrypted-password',
                'is_shared' => true,
                'is_active' => true,
                'member_ids' => [$admin->id, $member->id],
                'manager_ids' => [$admin->id],
            ])
            ->assertRedirect(route('admin.mail.accounts.index'));

        $account = MailAccount::where('address', 'contacto@melkerven.test')->firstOrFail();

        $this->assertTrue($account->is_shared);
        $this->assertCount(2, $account->users);
        $this->assertTrue($account->users()->whereKey($admin)->first()->pivot->can_manage);
        $this->assertNotSame('encrypted-password', DB::table('mail_accounts')->where('id', $account->id)->value('incoming_password'));
    }

    public function test_an_admin_can_generate_a_shared_resend_mailbox_without_imap_credentials(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $member = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post(route('admin.mail.accounts.store'), [
                'address' => 'contacto@melkerven.test',
                'display_name' => 'Contacto Melkerven',
                'incoming_source' => 'resend',
                'incoming_validate_certificate' => true,
                'is_shared' => true,
                'is_active' => true,
                'member_ids' => [$admin->id, $member->id],
                'manager_ids' => [$admin->id],
            ])
            ->assertRedirect(route('admin.mail.accounts.index'));

        $account = MailAccount::where('address', 'contacto@melkerven.test')->firstOrFail();

        $this->assertSame('resend', $account->provider);
        $this->assertNull($account->incoming_host);
        $this->assertNull($account->incoming_password);
        $this->assertTrue($account->receivesThroughResend());
        $this->assertFalse($account->usesImap());
        $this->assertCount(2, $account->users);
    }

    public function test_an_imap_mailbox_history_import_is_queued_in_resumable_pages(): void
    {
        Queue::fake();
        $admin = User::factory()->create(['role' => 'admin']);
        $account = MailAccount::create([
            'address' => 'archivo@melkerven.test',
            'provider' => 'imap',
            'incoming_host' => 'imap.secureserver.net',
            'incoming_port' => 993,
            'incoming_encryption' => 'ssl',
            'incoming_username' => 'archivo@melkerven.test',
            'incoming_password' => 'encrypted-password',
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.mail.accounts.history-import', $account))
            ->assertRedirect();

        $this->assertSame('queued', $account->fresh()->history_import_status);
        Queue::assertPushed(ImportMailboxHistory::class, fn (ImportMailboxHistory $job) => $job->mailAccountId === $account->id);
    }

    public function test_history_folder_classification_prioritizes_inbox_and_sent_mail(): void
    {
        $sync = app(\App\Services\MailboxImapSynchronizer::class);

        $this->assertSame('inbox', $sync->folderType('INBOX'));
        $this->assertSame('sent', $sync->folderType('Enviados'));
        $this->assertSame('draft', $sync->folderType('Drafts'));
        $this->assertSame('trash', $sync->folderType('Papelera'));
    }
}
