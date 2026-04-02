<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mantenimiento - Melkerven</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background: #0b1120;
            color: #e2e8f0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .bg-grid {
            position: fixed; inset: 0;
            background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 40px 40px;
        }
        .bg-glow {
            position: fixed;
            width: 600px; height: 600px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%);
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            animation: pulse 4s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
        .container {
            position: relative; z-index: 1;
            text-align: center;
            max-width: 500px;
            padding: 20px;
        }
        .logo { margin-bottom: 40px; }
        .logo img { height: 50px; }
        .icon {
            width: 80px; height: 80px;
            margin: 0 auto 24px;
            background: rgba(14,165,233,0.1);
            border: 1px solid rgba(14,165,233,0.2);
            border-radius: 20px;
            display: flex; align-items: center; justify-content: center;
        }
        .icon svg { width: 40px; height: 40px; color: #0ea5e9; }
        h1 {
            font-size: 28px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 12px;
            letter-spacing: -0.02em;
        }
        h1 span { color: #0ea5e9; }
        p {
            font-size: 15px;
            color: #94a3b8;
            line-height: 1.6;
            margin-bottom: 32px;
        }
        .contact {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 12px 24px;
            border-radius: 12px;
            color: #cbd5e1;
            font-size: 14px;
            text-decoration: none;
            transition: all 0.2s;
        }
        .contact:hover {
            border-color: rgba(14,165,233,0.3);
            background: rgba(14,165,233,0.05);
        }
        .status {
            margin-top: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-weight: 600;
        }
        .status-dot {
            width: 8px; height: 8px;
            background: #f59e0b;
            border-radius: 50%;
            animation: blink 1.5s ease-in-out infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
    </style>
</head>
<body>
    <div class="bg-grid"></div>
    <div class="bg-glow"></div>
    <div class="container">
        <div class="logo">
            <img src="/images/logo-light.png" alt="Melkerven">
        </div>
        <div class="icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17l-5.5-5.5a3.515 3.515 0 01-1.42-2.83V4.82A2.82 2.82 0 017.32 2h1.52a3.515 3.515 0 012.83 1.42l.34.34.34-.34A3.515 3.515 0 0115.18 2h1.52A2.82 2.82 0 0119.5 4.82v2.02a3.515 3.515 0 01-1.42 2.83l-5.5 5.5a1 1 0 01-1.16 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
            </svg>
        </div>
        <h1>Estamos en <span>mantenimiento</span></h1>
        <p>Estamos realizando mejoras para brindarte una mejor experiencia. Volveremos en breve.</p>
        <a href="mailto:contacto@melkerven.net" class="contact">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            contacto@melkerven.net
        </a>
        <div class="status">
            <span class="status-dot"></span>
            Mantenimiento en progreso
        </div>
    </div>
</body>
</html>
