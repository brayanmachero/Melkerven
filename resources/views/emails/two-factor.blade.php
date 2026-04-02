<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b1120; color: #e2e8f0; margin: 0; padding: 0; }
        .container { max-width: 500px; margin: 40px auto; background: #1e293b; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; }
        .header { background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 30px; text-align: center; }
        .header h1 { margin: 0; color: #fff; font-size: 20px; letter-spacing: 2px; }
        .body { padding: 40px 30px; text-align: center; }
        .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0ea5e9; background: #0f172a; padding: 20px 30px; border-radius: 8px; display: inline-block; margin: 20px 0; border: 1px solid rgba(14,165,233,0.2); }
        .info { color: #94a3b8; font-size: 14px; line-height: 1.6; }
        .warning { color: #f59e0b; font-size: 12px; margin-top: 20px; }
        .footer { padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
        .footer p { color: #475569; font-size: 11px; margin: 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MELKERVEN — VERIFICACIÓN 2FA</h1>
        </div>
        <div class="body">
            <p class="info">Hola <strong style="color:#fff;">{{ $user->name }}</strong>,</p>
            <p class="info">Tu código de verificación de dos factores es:</p>
            <div class="code">{{ $user->two_factor_code }}</div>
            <p class="info">Este código expira en <strong style="color:#fff;">10 minutos</strong>.</p>
            <p class="warning">⚠ Si no intentaste iniciar sesión, cambia tu contraseña inmediatamente.</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} Melkerven — Servers, Networking & Storage Hardware</p>
        </div>
    </div>
</body>
</html>
