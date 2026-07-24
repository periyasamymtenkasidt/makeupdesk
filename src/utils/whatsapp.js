const PHONE = import.meta.env.VITE_WHATSAPP_NUMBER ?? '919999999999'

export const buildWhatsAppUrl = (form) => {
  const lines = [
    `Hi! I'd like to book an appointment. 💄`,
    '',
    `*Name:* ${form.name}`,
    `*Phone:* ${form.phone}`,
    `*Service:* ${form.service}`,
    `*Event Date:* ${form.date}`,
    `*Shift:* ${form.shift}`,
    `*Location:* ${form.location}`,
    form.notes ? `*Notes:* ${form.notes}` : null,
  ].filter(Boolean).join('\n')

  return `https://wa.me/${PHONE}?text=${encodeURIComponent(lines)}`
}

export const chatOnWhatsApp = (msg = "Hi! I'd like to know more about your services.") =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`
