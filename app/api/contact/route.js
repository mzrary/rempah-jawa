import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Rempah Jawa <onboarding@resend.dev>',
        to: process.env.TO_EMAIL,
        subject: `📩 Pesan baru dari ${name} — Rempah Jawa`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0A0602;color:#F5E6C8;padding:40px;border-radius:16px;">
            <h2 style="color:#8BC34A;margin-bottom:4px;">📩 Pesan Baru Masuk!</h2>
            <p style="color:#A89070;margin-top:0;">Dari website Rempah Jawa</p>
            <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin:24px 0;">
              <div style="margin-bottom:12px;">
                <span style="color:#6B7280;font-size:13px;">Nama:</span>
                <div style="color:#F5E6C8;font-weight:600;margin-top:2px;">${name}</div>
              </div>
              <div style="margin-bottom:12px;">
                <span style="color:#6B7280;font-size:13px;">Email:</span>
                <div style="color:#D4A017;margin-top:2px;">${email}</div>
              </div>
              <div>
                <span style="color:#6B7280;font-size:13px;">Pesan:</span>
                <div style="color:#C8B99A;margin-top:6px;line-height:1.7;white-space:pre-line;">${message}</div>
              </div>
            </div>
            <a href="mailto:${email}" style="display:inline-block;background:linear-gradient(135deg,#8BC34A,#5D9E21);color:white;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:700;font-size:14px;">
              Balas Email
            </a>
            <p style="color:#4B5563;font-size:12px;margin-top:28px;">— Website Rempah Jawa 🌿</p>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('Resend error:', err)
      return NextResponse.json({ error: 'Gagal kirim email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
