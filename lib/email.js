// lib/email.js
// ============================================================
// Email notifications menggunakan Resend (gratis 3000 email/bln)
// Install: npm install resend
// Daftar: https://resend.com
// ============================================================

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL     = process.env.FROM_EMAIL || 'Rempah Jawa <hello@rempah-jawa.id>'

async function sendEmail({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  })
  if (!res.ok) {
    const err = await res.json()
    console.error('Email error:', err)
  }
  return res.json()
}

// ============================================================
// Email: Konfirmasi Pre-Order masuk (ke pelanggan)
// ============================================================
export async function emailPreOrderReceived({ customerEmail, customerName, preorderNumber, productName, qty, unit }) {
  return sendEmail({
    to: customerEmail,
    subject: `Pre-Order Diterima - ${preorderNumber} | Rempah Jawa`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0A0602;color:#F5E6C8;padding:40px;border-radius:16px;">
        <h2 style="color:#8BC34A;margin-bottom:8px;">✅ Pre-Order Diterima!</h2>
        <p style="color:#A89070;">Halo <strong>${customerName}</strong>,</p>
        <p style="color:#A89070;">Pre-order Anda telah kami terima. Kami akan konfirmasi ketersediaan dalam <strong>1×24 jam</strong>.</p>
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin:24px 0;">
          <div style="margin-bottom:8px;"><span style="color:#6B7280;">No. Pre-Order:</span> <strong style="color:#D4A017;">${preorderNumber}</strong></div>
          <div style="margin-bottom:8px;"><span style="color:#6B7280;">Produk:</span> <strong>${productName}</strong></div>
          <div><span style="color:#6B7280;">Jumlah:</span> <strong>${qty} ${unit}</strong></div>
        </div>
        <p style="color:#6B7280;font-size:14px;">Kami akan menghubungi Anda via WhatsApp atau email ini setelah konfirmasi.</p>
        <p style="color:#6B7280;font-size:13px;margin-top:32px;">— Tim Rempah Jawa 🌿</p>
      </div>
    `,
  })
}

// ============================================================
// Email: Pre-Order Disetujui (ke pelanggan) + link bayar
// ============================================================
export async function emailPreOrderApproved({ customerEmail, customerName, preorderNumber, productName, qty, unit, total, paymentUrl }) {
  return sendEmail({
    to: customerEmail,
    subject: `✅ Pre-Order Disetujui - ${preorderNumber} | Rempah Jawa`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0A0602;color:#F5E6C8;padding:40px;border-radius:16px;">
        <h2 style="color:#8BC34A;">🎉 Pre-Order Anda Disetujui!</h2>
        <p style="color:#A89070;">Halo <strong>${customerName}</strong>, produk yang Anda pesan <strong>tersedia</strong>!</p>
        <div style="background:rgba(212,160,23,0.1);border:1px solid rgba(212,160,23,0.25);border-radius:12px;padding:20px;margin:24px 0;">
          <div style="margin-bottom:8px;"><span style="color:#6B7280;">No. Pre-Order:</span> <strong style="color:#D4A017;">${preorderNumber}</strong></div>
          <div style="margin-bottom:8px;"><span style="color:#6B7280;">Produk:</span> <strong>${productName} — ${qty} ${unit}</strong></div>
          <div><span style="color:#6B7280;">Total Bayar:</span> <strong style="color:#8BC34A;font-size:18px;">Rp ${total.toLocaleString('id-ID')}</strong></div>
        </div>
        <a href="${paymentUrl}" style="display:inline-block;background:linear-gradient(135deg,#8BC34A,#5D9E21);color:white;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:16px;margin-bottom:20px;">
          💳 Bayar Sekarang
        </a>
        <p style="color:#6B7280;font-size:13px;">Link pembayaran aktif selama <strong>24 jam</strong>. Hubungi kami jika ada pertanyaan.</p>
        <p style="color:#6B7280;font-size:13px;margin-top:32px;">— Tim Rempah Jawa 🌿</p>
      </div>
    `,
  })
}

// ============================================================
// Email: Pre-Order Ditolak (ke pelanggan)
// ============================================================
export async function emailPreOrderRejected({ customerEmail, customerName, preorderNumber, productName, adminNotes }) {
  return sendEmail({
    to: customerEmail,
    subject: `Pre-Order Tidak Tersedia - ${preorderNumber} | Rempah Jawa`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0A0602;color:#F5E6C8;padding:40px;border-radius:16px;">
        <h2 style="color:#F87171;">Maaf, Stok Tidak Tersedia</h2>
        <p style="color:#A89070;">Halo <strong>${customerName}</strong>,</p>
        <p style="color:#A89070;">Mohon maaf, <strong>${productName}</strong> (Pre-Order <strong>${preorderNumber}</strong>) saat ini belum tersedia.</p>
        ${adminNotes ? `<div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:16px;margin:20px 0;color:#8A7A60;font-size:14px;">${adminNotes}</div>` : ''}
        <p style="color:#A89070;">Kami akan menghubungi Anda kembali saat stok tersedia. Terima kasih atas pengertiannya.</p>
        <p style="color:#6B7280;font-size:13px;margin-top:32px;">— Tim Rempah Jawa 🌿</p>
      </div>
    `,
  })
}

// ============================================================
// Email: Konfirmasi Pembayaran Berhasil
// ============================================================
export async function emailPaymentSuccess({ customerEmail, customerName, orderNumber, total, items }) {
  const itemsHtml = items.map(i =>
    `<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:#8A7A60;">${i.name} ×${i.qty}</span><span>Rp ${(i.price * i.qty).toLocaleString('id-ID')}</span></div>`
  ).join('')

  return sendEmail({
    to: customerEmail,
    subject: `✅ Pembayaran Berhasil - ${orderNumber} | Rempah Jawa`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0A0602;color:#F5E6C8;padding:40px;border-radius:16px;">
        <h2 style="color:#8BC34A;">✅ Pembayaran Berhasil!</h2>
        <p style="color:#A89070;">Halo <strong>${customerName}</strong>, pembayaran Anda telah dikonfirmasi.</p>
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin:24px 0;">
          <div style="margin-bottom:16px;"><span style="color:#6B7280;">No. Pesanan:</span> <strong style="color:#D4A017;">${orderNumber}</strong></div>
          ${itemsHtml}
          <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;margin-top:8px;display:flex;justify-content:space-between;">
            <strong>Total</strong><strong style="color:#8BC34A;">Rp ${total.toLocaleString('id-ID')}</strong>
          </div>
        </div>
        <p style="color:#A89070;">Pesanan Anda sedang diproses dan akan segera dikemas. Kami akan kirimkan info pengiriman via WhatsApp.</p>
        <p style="color:#6B7280;font-size:13px;margin-top:32px;">— Tim Rempah Jawa 🌿</p>
      </div>
    `,
  })
}
