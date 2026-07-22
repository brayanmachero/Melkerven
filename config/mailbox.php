<?php

return [
    /*
    | The real mailbox server will remain the canonical copy of the email.
    | Laravel reads it over IMAP; it never exposes IMAP passwords to browsers.
    */
    'sync' => [
        'initial_days' => (int) env('MAILBOX_INITIAL_SYNC_DAYS', 30),
        'max_messages_per_run' => (int) env('MAILBOX_MAX_MESSAGES_PER_SYNC', 250),
        'max_attachment_bytes' => (int) env('MAILBOX_MAX_ATTACHMENT_BYTES', 25 * 1024 * 1024),
    ],
];
