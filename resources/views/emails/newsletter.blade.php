<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #0b1120; color: #e2e8f0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 40px; }
        .logo { text-align: center; margin-bottom: 30px; }
        .content { font-size: 15px; line-height: 1.6; color: #cbd5e1; }
        .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
        .footer a { color: #0ea5e9; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="{{ asset('images/logo-light.png') }}" alt="Melkerven" style="height: 40px;">
        </div>
        <div class="content">
            {!! nl2br(e($emailContent)) !!}
        </div>
        <div class="footer">
            <p>Melkerven - Servers, Networking & Storage Hardware</p>
            <p><a href="{{ $unsubscribeUrl }}">Desuscribirse</a></p>
        </div>
    </div>
</body>
</html>
