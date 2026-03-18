// ============================================================
// BUMIREMPAH — NEXT.JS API ROUTES
// Letakkan masing-masing file di folder pages/api/
// ============================================================

// ============================================================
// FILE 1: pages/api/products/index.js
// GET /api/products — ambil semua produk
// ============================================================
/*
import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { category, available } = req.query

  let query = supabase.from('products').select('*').order('category').order('name')

  if (category && category !== 'all') query = query.eq('category', category)
  if (available === 'true') query = query.eq('available', true)

  const { data, error } = await query

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data)
}
*/

// ============================================================
// FILE 2: pages/api/orders/create.js
// POST /api/orders/create — buat pesanan baru + invoice Xendit
// ============================================================
/*
import { supabaseAdmin } from '@/lib/supabase'
import { createXenditInvoice } from '@/lib/xendit'
import { emailPaymentSuccess } from '@/lib/email'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { customer, items, paymentMethod } = req.body

  // Validasi input
  if (!customer?.name || !customer?.email || !customer?.phone || !items?.length) {
    return res.status(400).json({ error: 'Data tidak lengkap' })
  }

  // 1. Upsert customer
  const { data: cust, error: custErr } = await supabaseAdmin
    .from('customers')
    .upsert({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address, city: customer.city, zip: customer.zip }, { onConflict: 'email' })
    .select().single()

  if (custErr) return res.status(500).json({ error: custErr.message })

  // 2. Hitung total
  const subtotal     = items.reduce((s, i) => s + i.price * i.qty, 0)
  const shippingCost = 25000
  const total        = subtotal + shippingCost

  // 3. Buat order di database
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert({
      customer_id:     cust.id,
      status:          'pending',
      subtotal,
      shipping_cost:   shippingCost,
      total,
      payment_method:  paymentMethod,
      shipping_address: `${customer.address}, ${customer.city} ${customer.zip}`,
    })
    .select().single()

  if (orderErr) return res.status(500).json({ error: orderErr.message })

  // 4. Simpan order items
  const orderItems = items.map(i => ({
    order_id:   order.id,
    product_id: i.id,
    name:       i.name,
    price:      i.price,
    qty:        i.qty,
    subtotal:   i.price * i.qty,
  }))

  await supabaseAdmin.from('order_items').insert(orderItems)

  // 5. Buat invoice Xendit
  let invoiceUrl = null
  if (paymentMethod !== 'cod') {
    try {
      const invoice = await createXenditInvoice({
        externalId:  order.order_number,
        amount:      total,
        payerEmail:  customer.email,
        payerName:   customer.name,
        description: `Pesanan Rempah Jawa ${order.order_number}`,
        items:       items.map(i => ({ name: i.name, quantity: i.qty, price: i.price, category: i.category || 'produk' })),
      })

      // Simpan xendit invoice ID ke order
      await supabaseAdmin.from('orders')
        .update({ xendit_invoice_id: invoice.invoiceId, xendit_invoice_url: invoice.invoiceUrl })
        .eq('id', order.id)

      invoiceUrl = invoice.invoiceUrl
    } catch (e) {
      console.error('Xendit error:', e.message)
    }
  }

  return res.status(200).json({
    success:     true,
    orderNumber: order.order_number,
    orderId:     order.id,
    total,
    invoiceUrl,
    isCOD:       paymentMethod === 'cod',
  })
}
*/

// ============================================================
// FILE 3: pages/api/preorders/create.js
// POST /api/preorders/create — buat pre-order baru
// ============================================================
/*
import { supabaseAdmin } from '@/lib/supabase'
import { emailPreOrderReceived } from '@/lib/email'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { customer, productId, qty, desiredDate, notes } = req.body

  if (!customer?.name || !customer?.email || !customer?.phone || !productId) {
    return res.status(400).json({ error: 'Data tidak lengkap' })
  }

  // 1. Ambil data produk
  const { data: product } = await supabaseAdmin
    .from('products').select('*').eq('id', productId).single()

  if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' })

  // 2. Upsert customer
  const { data: cust } = await supabaseAdmin
    .from('customers')
    .upsert({ name: customer.name, email: customer.email, phone: customer.phone }, { onConflict: 'email' })
    .select().single()

  // 3. Buat preorder
  const { data: preorder, error } = await supabaseAdmin
    .from('preorders')
    .insert({
      customer_id:    cust.id,
      product_id:     productId,
      product_name:   product.name,
      product_price:  product.price,
      qty:            qty || 1,
      total_estimate: product.price * (qty || 1),
      desired_date:   desiredDate || null,
      notes:          notes || null,
      status:         'waiting_approval',
    })
    .select().single()

  if (error) return res.status(500).json({ error: error.message })

  // 4. Kirim email konfirmasi ke pelanggan
  await emailPreOrderReceived({
    customerEmail:  customer.email,
    customerName:   customer.name,
    preorderNumber: preorder.preorder_number,
    productName:    product.name,
    qty:            preorder.qty,
    unit:           product.unit,
  })

  return res.status(200).json({
    success:        true,
    preorderNumber: preorder.preorder_number,
    preorderId:     preorder.id,
    status:         'waiting_approval',
  })
}
*/

// ============================================================
// FILE 4: pages/api/preorders/[id]/approve.js
// POST /api/preorders/[id]/approve — admin approve pre-order
// ============================================================
/*
import { supabaseAdmin } from '@/lib/supabase'
import { createXenditInvoice } from '@/lib/xendit'
import { emailPreOrderApproved } from '@/lib/email'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  // TODO: Tambahkan auth check untuk admin di sini
  // const session = await getServerSession(req, res, authOptions)
  // if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const { id } = req.query
  const { adminNotes } = req.body

  // 1. Ambil data preorder + customer
  const { data: po } = await supabaseAdmin
    .from('preorders')
    .select('*, customers(*)')
    .eq('id', id).single()

  if (!po) return res.status(404).json({ error: 'Pre-order tidak ditemukan' })
  if (po.status !== 'waiting_approval') return res.status(400).json({ error: 'Status tidak valid' })

  const shippingCost = 25000
  const total = po.total_estimate + shippingCost

  // 2. Buat Xendit invoice
  const invoice = await createXenditInvoice({
    externalId:  po.preorder_number,
    amount:      total,
    payerEmail:  po.customers.email,
    payerName:   po.customers.name,
    description: `Pre-Order Rempah Jawa ${po.preorder_number} — ${po.product_name}`,
    items: [{
      name:     po.product_name,
      quantity: po.qty,
      price:    po.product_price,
      category: 'pre-order',
    }],
  })

  // 3. Update preorder status
  await supabaseAdmin.from('preorders').update({
    status:            'approved',
    admin_notes:       adminNotes || null,
    xendit_invoice_id: invoice.invoiceId,
    xendit_invoice_url: invoice.invoiceUrl,
    approved_at:       new Date().toISOString(),
  }).eq('id', id)

  // 4. Kirim email ke pelanggan
  await emailPreOrderApproved({
    customerEmail:  po.customers.email,
    customerName:   po.customers.name,
    preorderNumber: po.preorder_number,
    productName:    po.product_name,
    qty:            po.qty,
    unit:           'kg',
    total,
    paymentUrl:     invoice.invoiceUrl,
  })

  return res.status(200).json({ success: true, invoiceUrl: invoice.invoiceUrl })
}
*/

// ============================================================
// FILE 5: pages/api/preorders/[id]/reject.js
// POST /api/preorders/[id]/reject — admin reject pre-order
// ============================================================
/*
import { supabaseAdmin } from '@/lib/supabase'
import { emailPreOrderRejected } from '@/lib/email'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { id } = req.query
  const { adminNotes } = req.body

  const { data: po } = await supabaseAdmin
    .from('preorders')
    .select('*, customers(*)')
    .eq('id', id).single()

  if (!po) return res.status(404).json({ error: 'Tidak ditemukan' })

  await supabaseAdmin.from('preorders').update({
    status:      'rejected',
    admin_notes: adminNotes || null,
    rejected_at: new Date().toISOString(),
  }).eq('id', id)

  await emailPreOrderRejected({
    customerEmail:  po.customers.email,
    customerName:   po.customers.name,
    preorderNumber: po.preorder_number,
    productName:    po.product_name,
    adminNotes,
  })

  return res.status(200).json({ success: true })
}
*/

// ============================================================
// FILE 6: pages/api/webhooks/xendit.js
// POST /api/webhooks/xendit — terima callback dari Xendit
// ============================================================
/*
import { supabaseAdmin } from '@/lib/supabase'
import { verifyXenditWebhook } from '@/lib/xendit'
import { emailPaymentSuccess } from '@/lib/email'

// Matikan body parser bawaan Next.js
export const config = { api: { bodyParser: true } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  // 1. Verifikasi webhook token
  if (!verifyXenditWebhook(req)) {
    return res.status(401).json({ error: 'Invalid webhook token' })
  }

  const { id, external_id, status, payment_method, paid_amount } = req.body

  // Hanya proses status PAID
  if (status !== 'PAID') return res.status(200).json({ received: true })

  // 2. Cek apakah ini order biasa atau pre-order
  const isPreOrder = external_id.startsWith('PO-')

  if (isPreOrder) {
    // Update preorder → paid
    await supabaseAdmin.from('preorders').update({
      status:           'paid',
      xendit_payment_id: id,
      paid_at:          new Date().toISOString(),
    }).eq('preorder_number', external_id)

    // Ambil data untuk email
    const { data: po } = await supabaseAdmin
      .from('preorders')
      .select('*, customers(*)')
      .eq('preorder_number', external_id).single()

    if (po) {
      await emailPaymentSuccess({
        customerEmail: po.customers.email,
        customerName:  po.customers.name,
        orderNumber:   external_id,
        total:         paid_amount,
        items: [{ name: po.product_name, price: po.product_price, qty: po.qty }],
      })
    }
  } else {
    // Update order biasa → paid
    await supabaseAdmin.from('orders').update({
      status:           'paid',
      xendit_payment_id: id,
      paid_at:          new Date().toISOString(),
    }).eq('order_number', external_id)

    // Ambil data untuk email
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('*, customers(*), order_items(*)')
      .eq('order_number', external_id).single()

    if (order) {
      await emailPaymentSuccess({
        customerEmail: order.customers.email,
        customerName:  order.customers.name,
        orderNumber:   external_id,
        total:         paid_amount,
        items:         order.order_items,
      })
    }
  }

  // 3. Catat di audit log
  await supabaseAdmin.from('audit_logs').insert({
    table_name: isPreOrder ? 'preorders' : 'orders',
    record_id:  req.body.id,
    action:     'payment_received',
    new_values: { xendit_id: id, amount: paid_amount, method: payment_method },
  })

  return res.status(200).json({ received: true })
}
*/

// ============================================================
// FILE 7: pages/api/admin/dashboard.js
// GET /api/admin/dashboard — data untuk admin dashboard
// ============================================================
/*
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  // TODO: Tambahkan auth admin di sini

  const [
    { data: pendingPO },
    { data: recentOrders },
    { data: products },
    { count: totalOrders },
  ] = await Promise.all([
    supabaseAdmin.from('preorders').select('*, customers(name,email,phone)').eq('status', 'waiting_approval').order('created_at', { ascending: false }),
    supabaseAdmin.from('orders').select('*, customers(name)').order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('products').select('*').order('category'),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'paid'),
  ])

  // Hitung revenue bulan ini
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const { data: monthOrders } = await supabaseAdmin
    .from('orders').select('total').eq('status', 'paid').gte('paid_at', startOfMonth)
  const monthlyRevenue = (monthOrders || []).reduce((s, o) => s + o.total, 0)

  return res.status(200).json({
    pendingPreorders: pendingPO || [],
    recentOrders:     recentOrders || [],
    products:         products || [],
    stats: {
      totalOrders,
      monthlyRevenue,
      pendingCount: pendingPO?.length || 0,
    },
  })
}
*/

export default {}
