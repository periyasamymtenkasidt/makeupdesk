import { generateQuotePDF } from './generateQuotePDF'
import { generateBalanceInvoicePDF } from './generateBalanceInvoicePDF'

const PHONE = import.meta.env.VITE_WHATSAPP_NUMBER ?? '919999999999'

export const buildWhatsAppUrl = (form) => {
  const lines = [
    `Hi! I'd like to book an appointment. 💄`,
    '',
    `*Name:* ${form.name}`,
    `*Phone:* ${form.phone}`,
    `*Service:* ${form.service}`,
    `*Event Date:* ${form.date}`,
    `*Time:* ${form.time}`,
    `*Location:* ${form.location}`,
    form.notes ? `*Notes:* ${form.notes}` : null,
  ].filter(Boolean).join('\n')

  return `https://wa.me/${PHONE}?text=${encodeURIComponent(lines)}`
}

export const chatOnWhatsApp = (msg = "Hi! I'd like to know more about your services.") =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`

export function waPhone(phone) {
  if (!phone) return ''
  let digits = String(phone).replace(/\D/g, '')
  if (!digits) return ''

  // Strip leading zero if present
  if (digits.startsWith('0')) {
    digits = digits.replace(/^0+/, '')
  }

  // Standard 10-digit Indian mobile number -> prepend country code '91'
  if (digits.length === 10) {
    return '91' + digits
  }

  // 12-digit number starting with '91' -> return as is
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits
  }

  // Prepend '91' if missing
  if (!digits.startsWith('91') && digits.length < 12) {
    return '91' + digits
  }

  return digits
}

export function buildWhatsAppFollowUp(appt, customAmount, note) {
  let upiText = ''
  const amount = customAmount !== undefined ? customAmount : (appt?.amount || 0)
  try {
    const saved = JSON.parse(localStorage.getItem('md_settings') || '{}')
    const upiId = saved.upiId || 'makeupdesk@upi'
    const pct = saved.advancePct || 40
    const studioName = saved.studioName || 'MakeupDesk'
    const adv = amount ? Math.round(amount * (pct / 100)) : 0
    if (adv > 0) {
      upiText = `💰 *Total Amount:* ₹${amount.toLocaleString('en-IN')}\n💳 *Advance Deposit (${pct}%):* ₹${adv.toLocaleString('en-IN')}\n📲 *UPI ID for Payment:* ${upiId}\n`
    }
  } catch (e) {
    console.error(e)
  }

  const studioName = (() => { try { return JSON.parse(localStorage.getItem('md_settings') || '{}').studioName || 'MakeupDesk' } catch { return 'MakeupDesk' } })()

  const msg = [
    `Hi ${appt?.name || 'Client'}! 💄✨`,
    '',
    `Here is your official quotation from *${studioName}* for *${appt?.service || 'Makeup Service'}* on *${appt?.date || ''}* at *${appt?.time || 'scheduled time'}*.`,
    '',
    upiText,
    note ? `📝 *Note:* ${note}\n` : null,
    `📄 *Quote PDF:* Downloaded & ready to attach in this chat.`,
    '',
    `To confirm your slot, please pay the advance deposit via UPI and reply with your payment screenshot. Looking forward to making you look stunning! 👑`,
  ].filter(Boolean).join('\n')

  const rawPhone = appt?.phone || appt?.clientPhone || ''
  const phoneNum = waPhone(rawPhone)

  // Use web.whatsapp.com/send/?phone= (WITH trailing slash / after send) for desktop WhatsApp Web
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (phoneNum) {
    if (isMobile) {
      return `https://api.whatsapp.com/send/?phone=${phoneNum}&text=${encodeURIComponent(msg)}`
    }
    return `https://web.whatsapp.com/send/?phone=${phoneNum}&text=${encodeURIComponent(msg)}`
  }
  return isMobile
    ? `https://api.whatsapp.com/send/?text=${encodeURIComponent(msg)}`
    : `https://web.whatsapp.com/send/`
}

export async function sendQuoteViaWhatsApp(appt, customAmount, note) {
  const { fileName, file } = await generateQuotePDF(appt, customAmount, note)
  const waUrl = buildWhatsAppFollowUp(appt, customAmount, note)

  // 1. Try Web Share API (mobile & supported browsers attach the PDF directly to WhatsApp)
  if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      const saved = JSON.parse(localStorage.getItem('md_settings') || '{}')
      const upiId = saved.upiId || 'makeupdesk@upi'
      const pct = saved.advancePct || 40
      const amount = customAmount !== undefined ? customAmount : (appt?.amount || 0)
      const adv = amount ? Math.round(amount * (pct / 100)) : 0

      const shareStudioName = saved.studioName || 'MakeupDesk'
      const shareText = [
        `Hi ${appt?.name || 'Client'}! 💄✨`,
        `Here is your official quotation from ${shareStudioName} for ${appt?.service || 'Makeup Service'} on ${appt?.date || ''}.`,
        adv > 0 ? `Total Amount: ₹${amount.toLocaleString('en-IN')} | Advance (${pct}%): ₹${adv.toLocaleString('en-IN')} (UPI: ${upiId})` : '',
        note ? `Note: ${note}` : '',
        'Official PDF Quote attached.',
      ].filter(Boolean).join('\n')

      await navigator.share({
        title: `Quote #${appt?.id || ''} - ${appt?.name || ''}`,
        text: shareText,
        files: [file],
      })
      return { success: true, method: 'share', fileName }
    } catch (err) {
      if (err.name === 'AbortError') return { success: false, cancelled: true }
    }
  }

  // 2. Desktop Browser fallback: PDF downloaded & WhatsApp Web opened with phone number mapped
  window.open(waUrl, '_blank')
  return { success: true, method: 'download_and_whatsapp', fileName }
}

export function buildWhatsAppBalanceInvoice(appt) {
  let upiText = ''
  const totalAmount   = Number(appt?.amount || 0)
  const advanceAmount = appt?.advancePaid ? Number(appt?.advanceAmount || 0) : 0
  const balanceDue    = Math.max(0, totalAmount - advanceAmount)

  try {
    const saved = JSON.parse(localStorage.getItem('md_settings') || '{}')
    const upiId = saved.upiId || 'makeupdesk@upi'
    upiText = `💰 *Total Package Amount:* ₹${totalAmount.toLocaleString('en-IN')}\n✅ *Advance Paid:* ₹${advanceAmount.toLocaleString('en-IN')}\n💳 *Remaining Balance Due:* ₹${balanceDue.toLocaleString('en-IN')}\n📲 *UPI ID for Payment:* ${upiId}\n`
  } catch (e) {
    console.error(e)
  }

  const balStudioName = (() => { try { return JSON.parse(localStorage.getItem('md_settings') || '{}').studioName || 'MakeupDesk' } catch { return 'MakeupDesk' } })()

  const msg = [
    `Hi ${appt?.name || 'Client'}! 💄✨`,
    `Hope you loved your *${appt?.service || 'Makeup'}* look today!`,
    '',
    `Here is your final Balance Invoice from *${balStudioName}*:`,
    '',
    upiText,
    `📄 *Balance Invoice PDF:* Downloaded & ready to attach in this chat.`,
    '',
    `Please pay the remaining balance of ₹${balanceDue.toLocaleString('en-IN')} via UPI or Cash and reply with your screenshot. Thank you for choosing ${balStudioName}! 👑`,
  ].filter(Boolean).join('\n')

  const rawPhone = appt?.phone || appt?.clientPhone || ''
  const phoneNum = waPhone(rawPhone)
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (phoneNum) {
    if (isMobile) {
      return `https://api.whatsapp.com/send/?phone=${phoneNum}&text=${encodeURIComponent(msg)}`
    }
    return `https://web.whatsapp.com/send/?phone=${phoneNum}&text=${encodeURIComponent(msg)}`
  }
  return isMobile
    ? `https://api.whatsapp.com/send/?text=${encodeURIComponent(msg)}`
    : `https://web.whatsapp.com/send/`
}

export async function sendBalanceInvoiceViaWhatsApp(appt) {
  const { fileName, file } = await generateBalanceInvoicePDF(appt)
  const waUrl = buildWhatsAppBalanceInvoice(appt)

  if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      const shareText = `Hi ${appt?.name || 'Client'}! Here is your Balance Invoice for ${appt?.service || 'Makeup Service'}. Total: ₹${appt?.amount || 0}. PDF attached below.`
      await navigator.share({
        title: `Balance Invoice #${appt?.id || ''} - ${appt?.name || ''}`,
        text: shareText,
        files: [file],
      })
      return { success: true, method: 'share', fileName }
    } catch (err) {
      if (err.name === 'AbortError') return { success: false, cancelled: true }
    }
  }

  window.open(waUrl, '_blank')
  return { success: true, method: 'download_and_whatsapp', fileName }
}
