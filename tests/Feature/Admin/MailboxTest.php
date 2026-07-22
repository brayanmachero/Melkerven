<?php

namespace Tests\Feature\Admin;

use App\Jobs\ProcessInboundEmail;
use App\Models\MailAlert;
use App\Models\MailAttachment;
use App\Models\MailAccount;
use App\Models\MailDraft;
use App\Models\MailDraftAttachment;
use App\Models\MailThread;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Resend\Email;
use Resend\Laravel\Facades\Resend;
use Resend\Laravel\Events\EmailReceived;
use Tests\TestCase;

class MailboxTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_admin_can_open_the_internal_mailbox(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('admin.mail.index'))
            ->assertOk();
    }

    public function test_opening_a_thread_marks_its_inbound_messages_as_read(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $thread = MailThread::create([
            'subject' => 'Consulta de prueba',
            'participant_email' => 'cliente@example.com',
            'last_direction' => 'inbound',
            'last_message_at' => now(),
        ]);

        $message = $thread->messages()->create([
            'direction' => 'inbound',
            'from_address' => 'cliente@example.com',
            'to_addresses' => ['soporte@melkerven.net'],
            'text_body' => 'Necesito ayuda con un pedido.',
            'is_read' => false,
            'received_at' => now(),
        ]);

        $this->actingAs($admin)
            ->get(route('admin.mail.show', $thread))
            ->assertOk();

        $this->assertTrue($message->refresh()->is_read);
    }

    public function test_resend_inbound_events_are_queued_for_processing(): void
    {
        Queue::fake();

        event(new EmailReceived([
            'type' => 'email.received',
            'data' => ['email_id' => 'email_inbound_123'],
        ]));

        Queue::assertPushed(ProcessInboundEmail::class, function (ProcessInboundEmail $job) {
            return $job->resendEmailId === 'email_inbound_123';
        });
    }

    public function test_an_admin_can_save_a_sanitized_html_signature(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->patch(route('admin.mail.settings.update'), [
                'mail_signature_html' => '<p style="color: #0ea5e9">Equipo <strong>Melkerven</strong></p><script>alert(1)</script><a href="javascript:alert(1)">malicioso</a>',
                'mail_in_app_notifications' => true,
                'mail_desktop_notifications' => false,
                'mail_sound_notifications' => false,
            ])
            ->assertSessionHasNoErrors();

        $admin->refresh();

        $this->assertStringContainsString('Equipo', $admin->mail_signature_html);
        $this->assertStringNotContainsString('<script', $admin->mail_signature_html);
        $this->assertStringNotContainsString('javascript:', $admin->mail_signature_html);
        $this->assertSame('Equipo Melkervenmalicioso', $admin->mail_signature_text);
    }

    public function test_notification_endpoint_returns_only_the_current_users_mail_alerts(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $otherAdmin = User::factory()->create(['role' => 'admin']);
        $thread = MailThread::create([
            'subject' => 'Nueva consulta',
            'participant_email' => 'cliente@example.com',
            'last_message_at' => now(),
        ]);

        MailAlert::create([
            'user_id' => $admin->id,
            'mail_thread_id' => $thread->id,
            'title' => 'Nuevo correo: Nueva consulta',
            'url' => '/admin/mail?folder=inbox&selected='.$thread->id,
        ]);
        MailAlert::create([
            'user_id' => $otherAdmin->id,
            'mail_thread_id' => $thread->id,
            'title' => 'No debe aparecer',
        ]);

        $this->actingAs($admin)
            ->getJson(route('admin.notifications'))
            ->assertOk()
            ->assertJsonPath('new_mail', 1)
            ->assertJsonCount(1, 'mail_alerts')
            ->assertJsonPath('mail_alerts.0.title', 'Nuevo correo: Nueva consulta');
    }

    public function test_an_admin_can_download_a_private_mail_attachment(): void
    {
        Storage::fake('local');
        $admin = User::factory()->create(['role' => 'admin']);
        $thread = MailThread::create([
            'subject' => 'Documento de prueba',
            'participant_email' => 'cliente@example.com',
            'last_message_at' => now(),
        ]);
        $message = $thread->messages()->create([
            'direction' => 'inbound',
            'from_address' => 'cliente@example.com',
            'to_addresses' => ['contacto@melkerven.net'],
            'text_body' => 'Adjunto una cotización.',
            'received_at' => now(),
        ]);
        $attachment = MailAttachment::create([
            'mail_message_id' => $message->id,
            'filename' => 'cotizacion.pdf',
            'content_type' => 'application/pdf',
            'size' => 7,
            'storage_disk' => 'local',
            'storage_path' => 'mail-attachments/inbound/test/cotizacion.pdf',
        ]);
        Storage::disk('local')->put($attachment->storage_path, 'PDF-test');

        $this->actingAs($admin)
            ->get(route('admin.mail.attachments.download', $attachment))
            ->assertOk()
            ->assertDownload('cotizacion.pdf', 'PDF-test');
    }

    public function test_a_valid_document_attachment_reaches_the_email_configuration_check(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post(route('admin.mail.send'), [
                'to' => 'delivered@resend.dev',
                'subject' => 'Cotización solicitada',
                'body' => 'Adjunto encontrarás la propuesta.',
                'attachments' => [UploadedFile::fake()->create('propuesta.pdf', 100, 'application/pdf')],
            ])
            ->assertSessionHasErrors('mailbox')
            ->assertSessionDoesntHaveErrors('attachments');
    }

    public function test_an_outgoing_email_stores_and_sends_an_uploaded_document(): void
    {
        Storage::fake('local');
        config([
            'resend.api_key' => 're_test',
            'mail.from.address' => 'contacto@melkerven.net',
            'mail.from.name' => 'Melkerven',
        ]);
        $admin = User::factory()->create([
            'role' => 'admin',
            'mail_signature_html' => '<p><strong>Equipo comercial</strong></p>',
            'mail_signature_text' => 'Equipo comercial',
        ]);
        $thread = MailThread::create([
            'subject' => 'Cotización industrial',
            'participant_email' => 'delivered@resend.dev',
            'last_message_at' => now(),
        ]);

        $emailService = \Mockery::mock(\Resend\Service\Email::class);
        $sentPayload = null;
        $emailService->shouldReceive('send')
            ->once()
            ->withAnyArgs()
            ->andReturnUsing(function (array $payload) use (&$sentPayload): Email {
                $sentPayload = $payload;

                return new Email(['id' => 'email_outbound_attachment_123']);
            })
            ;
        Resend::shouldReceive('emails')->once()->andReturn($emailService);

        $this->actingAs($admin)
            ->post(route('admin.mail.send'), [
                'thread_id' => $thread->id,
                'to' => 'delivered@resend.dev',
                'subject' => 'Re: Cotización industrial',
                'body' => 'Adjunto encontrarás la propuesta.',
                'attachments' => [UploadedFile::fake()->create('propuesta.pdf', 100, 'application/pdf')],
            ])
            ->assertRedirect(route('admin.mail.show', $thread));

        $this->assertSame('delivered@resend.dev', $sentPayload['to']);
        $this->assertSame('propuesta.pdf', $sentPayload['attachments'][0]['filename']);
        $this->assertIsString($sentPayload['attachments'][0]['content']);
        $this->assertStringContainsString('Equipo comercial', $sentPayload['html']);

        $attachment = MailAttachment::where('filename', 'propuesta.pdf')->firstOrFail();

        Storage::disk('local')->assertExists($attachment->storage_path);
        $this->assertSame($thread->id, $attachment->message->mail_thread_id);
    }

    public function test_an_admin_can_send_a_new_email_from_a_generated_resend_mailbox(): void
    {
        config([
            'resend.api_key' => 're_test',
            'mail.from.address' => 'default@melkerven.net',
            'mail.from.name' => 'Melkerven',
        ]);
        $admin = User::factory()->create(['role' => 'admin']);
        $account = MailAccount::create([
            'address' => 'contacto@melkerven.net',
            'display_name' => 'Contacto Melkerven',
            'provider' => 'resend',
            'is_shared' => true,
            'is_active' => true,
        ]);
        $account->users()->attach($admin, ['access_role' => 'owner', 'can_send' => true, 'can_manage' => true]);

        $emailService = \Mockery::mock(\Resend\Service\Email::class);
        $sentPayload = null;
        $emailService->shouldReceive('send')
            ->once()
            ->withAnyArgs()
            ->andReturnUsing(function (array $payload) use (&$sentPayload): Email {
                $sentPayload = $payload;

                return new Email(['id' => 'email_generated_mailbox_123']);
            });
        Resend::shouldReceive('emails')->once()->andReturn($emailService);

        $this->actingAs($admin)
            ->post(route('admin.mail.send'), [
                'mail_account_id' => $account->id,
                'to' => 'delivered@resend.dev',
                'subject' => 'Consulta comercial',
                'body' => 'Te escribimos desde el buzón del equipo.',
            ])
            ->assertRedirect();

        $thread = MailThread::where('mail_account_id', $account->id)->firstOrFail();

        $this->assertSame('Contacto Melkerven <contacto@melkerven.net>', $sentPayload['from']);
        $this->assertSame($account->id, $thread->mail_account_id);
        $this->assertSame('contacto@melkerven.net', $thread->mailbox);
    }

    public function test_an_admin_can_save_a_private_draft_with_an_attachment(): void
    {
        Storage::fake('local');
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post(route('admin.mail.drafts.save'), [
                'to' => 'cliente@example.com',
                'subject' => 'Cotización pendiente',
                'body' => 'Terminar la propuesta antes de enviar.',
                'attachments' => [UploadedFile::fake()->create('propuesta.pdf', 100, 'application/pdf')],
            ])
            ->assertRedirect(route('admin.mail.drafts'));

        $draft = MailDraft::where('user_id', $admin->id)->firstOrFail();
        $attachment = $draft->files()->firstOrFail();

        $this->assertSame('Cotización pendiente', $draft->subject);
        $this->assertSame('propuesta.pdf', $attachment->filename);
        Storage::disk('local')->assertExists($attachment->storage_path);
        $this->assertDatabaseHas('mail_activities', ['action' => 'draft.saved', 'actor_id' => $admin->id]);
    }

    public function test_sending_a_draft_transfers_its_private_attachment_to_the_sent_message(): void
    {
        Storage::fake('local');
        config([
            'resend.api_key' => 're_test',
            'mail.from.address' => 'contacto@melkerven.net',
            'mail.from.name' => 'Melkerven',
        ]);
        $admin = User::factory()->create(['role' => 'admin']);
        $draft = MailDraft::create([
            'user_id' => $admin->id,
            'to_address' => 'delivered@resend.dev',
            'subject' => 'Propuesta desde borrador',
            'body' => 'Adjuntamos la propuesta final.',
        ]);
        Storage::disk('local')->put('mail-attachments/drafts/test/propuesta.pdf', 'PDF-draft-content');
        $draftAttachment = MailDraftAttachment::create([
            'mail_draft_id' => $draft->id,
            'filename' => 'propuesta.pdf',
            'content_type' => 'application/pdf',
            'size' => strlen('PDF-draft-content'),
            'storage_disk' => 'local',
            'storage_path' => 'mail-attachments/drafts/test/propuesta.pdf',
            'checksum' => hash('sha256', 'PDF-draft-content'),
        ]);

        $emailService = \Mockery::mock(\Resend\Service\Email::class);
        $sentPayload = null;
        $emailService->shouldReceive('send')->once()->withAnyArgs()->andReturnUsing(function (array $payload) use (&$sentPayload): Email {
            $sentPayload = $payload;

            return new Email(['id' => 'email_draft_123']);
        });
        Resend::shouldReceive('emails')->once()->andReturn($emailService);

        $this->actingAs($admin)
            ->post(route('admin.mail.send'), [
                'draft_id' => $draft->id,
                'to' => $draft->to_address,
                'subject' => $draft->subject,
                'body' => $draft->body,
            ])
            ->assertRedirect();

        $this->assertSame('propuesta.pdf', $sentPayload['attachments'][0]['filename']);
        $this->assertDatabaseMissing('mail_drafts', ['id' => $draft->id]);
        $this->assertDatabaseMissing('mail_draft_attachments', ['id' => $draftAttachment->id]);
        Storage::disk('local')->assertMissing('mail-attachments/drafts/test/propuesta.pdf');
        $attachment = MailAttachment::where('filename', 'propuesta.pdf')->firstOrFail();
        Storage::disk('local')->assertExists($attachment->storage_path);
    }

    public function test_an_admin_can_restore_or_permanently_purge_a_trashed_conversation_and_its_files(): void
    {
        Storage::fake('local');
        $admin = User::factory()->create(['role' => 'admin']);
        $thread = MailThread::create([
            'subject' => 'Conversación eliminable',
            'participant_email' => 'cliente@example.com',
            'last_message_at' => now(),
        ]);
        $message = $thread->messages()->create([
            'direction' => 'inbound',
            'from_address' => 'cliente@example.com',
            'to_addresses' => ['contacto@melkerven.net'],
            'text_body' => 'Adjunto para eliminar.',
            'received_at' => now(),
        ]);
        $attachment = MailAttachment::create([
            'mail_message_id' => $message->id,
            'filename' => 'eliminar.pdf',
            'content_type' => 'application/pdf',
            'size' => 5,
            'storage_disk' => 'local',
            'storage_path' => 'mail-attachments/inbound/test/eliminar.pdf',
        ]);
        Storage::disk('local')->put($attachment->storage_path, 'PDF-x');

        $this->actingAs($admin)->delete(route('admin.mail.trash', $thread))->assertRedirect();
        $this->assertSoftDeleted('mail_threads', ['id' => $thread->id]);

        $this->actingAs($admin)->patch(route('admin.mail.restore', $thread->id))->assertRedirect();
        $this->assertDatabaseHas('mail_threads', ['id' => $thread->id, 'deleted_at' => null]);

        $this->actingAs($admin)->delete(route('admin.mail.trash', $thread))->assertRedirect();
        $this->actingAs($admin)->delete(route('admin.mail.purge', $thread->id))->assertRedirect();

        $this->assertDatabaseMissing('mail_threads', ['id' => $thread->id]);
        Storage::disk('local')->assertMissing('mail-attachments/inbound/test/eliminar.pdf');
        $this->assertDatabaseHas('mail_activities', ['action' => 'thread.purged', 'actor_id' => $admin->id]);
    }
}
