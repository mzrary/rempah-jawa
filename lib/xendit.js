// lib/xendit.js
// ============================================================
// Xendit helper — create invoice, check status, parse webhook
// ============================================================

const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY   // starts with xnd_production_ or xnd_development_
const XENDIT_BASE_URL   = 'https://api.xendit.co'
const XENDIT_CALLBACK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN

// Basic Auth header untuk Xendit
const xenditAuth = () =>
  'Basic ' + Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64')

// ============================================================
// CREATE INVOICE
// Dipakai untuk: order langsung & pre-order yang sudah approved
// ============================================================
export async function createXenditInvoice({
  externalId,       // ID unik kita, contoh: "ORD-20260318-001"
  amount,           // total dalam Rupiah (integer)
  payerEmail,
  payerName,
  description,
  items = [],       // array { name, quantity, price, category }
  successRedirectUrl,
  failureRedirectUrl,
}) {
  const body = {
    external_id:  externalId,
    amount,
    payer_email:  payerEmail,
    description,
    items,
    customer: { given_names: payerName, email: payerEmail },
    currency: 'IDR',
    success_redirect_url: successRedirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pembayaran/sukses`,
    failure_redirect_url: failureRedirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pembayaran/gagal`,
    // Payment methods yang diaktifkan
    payment_methods: ['QRIS', 'BCA', 'BNI', 'BRI', 'MANDIRI', 'OVO', 'DANA', 'SHOPEEPAY'],
    invoice_duration: 86400,  // 24 jam dalam detik
  }

  const res = await fetch(`${XENDIT_BASE_URL}/v2/invoices`, {
    method:  'POST',
    headers: {
      'Authorization': xenditAuth(),
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Xendit error: ${err.message || JSON.stringify(err)}`)
  }

  const data = await res.json()
  return {
    invoiceId:  data.id,
    invoiceUrl: data.invoice_url,
    status:     data.status,
    expiryDate: data.expiry_date,
  }
}

// ============================================================
// GET INVOICE STATUS
// ============================================================
export async function getXenditInvoice(invoiceId) {
  const res = await fetch(`${XENDIT_BASE_URL}/v2/invoices/${invoiceId}`, {
    headers: { 'Authorization': xenditAuth() },
  })
  if (!res.ok) throw new Error('Gagal mengambil status invoice Xendit')
  return res.json()
}

// ============================================================
// VERIFY WEBHOOK TOKEN
// Xendit mengirim header x-callback-token
// ============================================================
export function verifyXenditWebhook(req) {
  const token = req.headers['x-callback-token']
  return token === XENDIT_CALLBACK_TOKEN
}
