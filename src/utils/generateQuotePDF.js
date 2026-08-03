import { jsPDF } from 'jspdf'
import { formatCurrency } from './formatCurrency'

// jsPDF built-in fonts are Latin-1 only — strip non-Latin chars before rendering
function safe(str = '') {
  return str.replace(/[^\x00-\xFF]/g, '')  // drop rupee sign, emojis, etc.
}

function rupee(amount) {
  return formatCurrency(amount).replace('₹', 'Rs. ')
}

export async function generateQuotePDF(appt, amount, note, options = {}) {
  const doc  = new jsPDF({ unit: 'mm', format: 'a4' })
  const W    = 210
  const M    = 20          // margin
  const CW   = W - M * 2  // content width

  // Read settings for UPI & QR Code
  let upiId = 'makeupdesk@upi'
  let advancePct = 40
  let qrCodeImage = ''
  let studioName = 'MakeupDesk'
  let tagline = 'Professional Makeup Artist Studio'

  try {
    const saved = JSON.parse(localStorage.getItem('md_settings') || '{}')
    if (saved.upiId)       upiId      = saved.upiId
    if (saved.advancePct)  advancePct = Number(saved.advancePct)
    if (saved.qrCodeImage) qrCodeImage = saved.qrCodeImage
    if (saved.studioName)  studioName = saved.studioName
    if (saved.tagline)     tagline    = saved.tagline
  } catch (e) {
    console.error(e)
  }

  const advanceAmount = Math.round((Number(amount) || 0) * (advancePct / 100))
  let qrBase64 = null
  const qrUrl = qrCodeImage || (upiId ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${studioName}&am=${advanceAmount}&cu=INR`)}` : '')

  if (qrUrl) {
    qrBase64 = await new Promise(resolve => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = img.width || 250
          canvas.height = img.height || 250
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL('image/png'))
        } catch {
          resolve(null)
        }
      }
      img.onerror = () => resolve(null)
      img.src = qrUrl
    })
  }

  // ── Palette ───────────────────────────────────────────────────────────────
  const darkBrown = [28,  18,  10]
  const roseGold  = [201, 149, 108]
  const roseMid   = [220, 175, 135]
  const cream     = [253, 246, 238]
  const offWhite  = [248, 242, 235]
  const white     = [255, 255, 255]
  const textDark  = [28,  20,  12]
  const textMuted = [140, 115, 92]
  const borderClr = [225, 205, 185]

  // ────────────────────────────────────────────────────────────────────────
  //  HEADER
  // ────────────────────────────────────────────────────────────────────────
  // Dark band
  doc.setFillColor(...darkBrown)
  doc.rect(0, 0, W, 46, 'F')

  // Rose-gold accent stripe at bottom of header
  doc.setFillColor(...roseGold)
  doc.rect(0, 46, W, 2.5, 'F')

  // Brand name
  doc.setFont('times', 'bolditalic')
  doc.setFontSize(30)
  doc.setTextColor(255, 245, 230)
  doc.text(safe(studioName), M, 23)

  // Tagline
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...roseMid)
  doc.text(safe(tagline), M, 31)

  // Three decorative dots
  doc.setFillColor(...roseGold)
  ;[0, 5, 10].forEach(offset => doc.circle(M + offset, 38.5, 0.8, 'F'))

  // QUOTATION label (right)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...roseGold)
  doc.text('QUOTATION', W - M, 19, { align: 'right' })

  // Ref #
  doc.setFont('courier', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(210, 185, 155)
  doc.text(`# ${appt.id}`, W - M, 28, { align: 'right' })

  // Issue date
  const issued = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(160, 135, 110)
  doc.text(issued, W - M, 37, { align: 'right' })

  // ────────────────────────────────────────────────────────────────────────
  //  CLIENT BLOCK
  // ────────────────────────────────────────────────────────────────────────
  let y = 60

  // Left: Prepared for
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...textMuted)
  doc.text('PREPARED FOR', M, y)

  doc.setFont('times', 'bold')
  doc.setFontSize(17)
  doc.setTextColor(...textDark)
  doc.text(safe(appt.name), M, y + 9)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...textMuted)
  doc.text(appt.phone || '', M, y + 16)

  // Right: Valid until
  const validDate = new Date()
  validDate.setDate(validDate.getDate() + 7)
  const validStr = validDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...textMuted)
  doc.text('VALID UNTIL', W - M, y, { align: 'right' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...textDark)
  doc.text(validStr, W - M, y + 8, { align: 'right' })

  y += 24

  // ────────────────────────────────────────────────────────────────────────
  //  SERVICE DETAILS TABLE
  // ────────────────────────────────────────────────────────────────────────
  doc.setFillColor(...cream)
  doc.rect(M, y, CW, 9, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...textMuted)
  doc.text('SERVICE DETAILS', M + 5, y + 6)
  doc.text('DETAILS', W - M - 5, y + 6, { align: 'right' })

  y += 9

  const details = [
    ['Service Package', appt.service || 'Bridal Makeup'],
    ['Event Date',      appt.date    || '—'],
    ['Scheduled Time',  appt.time    || '—'],
    ['Duration',        appt.duration || '—'],
    ['Location Type',   appt.location || 'Studio'],
    ['Venue Address',   appt.venue   || 'Studio Venue'],
  ]

  details.forEach(([label, val], idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(...offWhite)
      doc.rect(M, y, CW, 8.5, 'F')
    }
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...textDark)
    doc.text(label, M + 5, y + 5.5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(safe(val), W - M - 5, y + 5.5, { align: 'right' })

    y += 8.5
  })

  // ────────────────────────────────────────────────────────────────────────
  //  TOTAL AMOUNT STRIP
  // ────────────────────────────────────────────────────────────────────────
  y += 6

  // Shadow effect
  doc.setFillColor(170, 120, 80)
  doc.roundedRect(M + 1, y + 1, CW, 24, 4, 4, 'F')

  // Main box
  doc.setFillColor(...roseGold)
  doc.roundedRect(M, y, CW, 28, 5, 5, 'F')

  // Label
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(255, 230, 200)
  doc.text('TOTAL QUOTE AMOUNT', M + 12, y + 10)

  // Amount value
  doc.setFont('times', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...white)
  doc.text(rupee(Number(amount) || 0), M + 12, y + 23)

  // Right sub-text
  y += 34

  // ────────────────────────────────────────────────────────────────────────
  //  ADVANCE DEPOSIT & UPI QR CODE BOX
  // ────────────────────────────────────────────────────────────────────────
  const payH = 34
  doc.setFillColor(...cream)
  doc.setDrawColor(...roseGold)
  doc.setLineWidth(0.5)
  doc.roundedRect(M, y, CW, payH, 4, 4, 'FD')

  // Left side payment info
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...roseGold)
  doc.text('ADVANCE DEPOSIT & UPI PAYMENT', M + 8, y + 8)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...textDark)
  doc.text(`Advance Required (${advancePct}%): ${rupee(advanceAmount)}`, M + 8, y + 16)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(160, 95, 45)
  doc.text(`UPI ID / VPA: ${upiId}`, M + 8, y + 23)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...textMuted)
  doc.text('Scan QR code or use UPI ID to pay advance deposit & confirm slot.', M + 8, y + 29)

  // Right side QR code
  if (qrBase64) {
    const qrSize = 26
    const qrX = W - M - qrSize - 5
    const qrY = y + 4
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2, 2, 2, 'F')
    doc.setDrawColor(210, 160, 120)
    doc.roundedRect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2, 2, 2, 'D')
    doc.addImage(qrBase64, 'PNG', qrX, qrY, qrSize, qrSize)
  }

  y += payH + 8

  // ────────────────────────────────────────────────────────────────────────
  //  NOTE  (only if provided)
  // ────────────────────────────────────────────────────────────────────────
  if (note && note.trim()) {
    const wrapped   = doc.splitTextToSize(safe(note.trim()), CW - 18)
    const noteH     = 10 + wrapped.length * 5.5 + 8

    doc.setFillColor(...roseGold)
    doc.rect(M, y, 3, noteH, 'F')

    doc.setFillColor(...offWhite)
    doc.rect(M + 3, y, CW - 3, noteH, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...roseGold)
    doc.text('NOTE', M + 10, y + 8)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...textDark)
    doc.text(wrapped, M + 10, y + 15)

    y += noteH + 10
  } else {
    y += 6
  }

  // ────────────────────────────────────────────────────────────────────────
  //  CTA STRIP  (bordered cream)
  // ────────────────────────────────────────────────────────────────────────
  doc.setFillColor(...cream)
  doc.setDrawColor(...roseGold)
  doc.setLineWidth(0.6)
  doc.roundedRect(M, y, CW, 16, 4, 4, 'FD')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...textDark)
  doc.text(
    'To confirm your slot, please pay the advance and reply on WhatsApp.',
    W / 2, y + 10,
    { align: 'center' }
  )

  // ────────────────────────────────────────────────────────────────────────
  //  THANK YOU LINE
  // ────────────────────────────────────────────────────────────────────────
  y += 24
  doc.setFont('times', 'italic')
  doc.setFontSize(11)
  doc.setTextColor(...roseMid)
  doc.text('Thank you for choosing MakeupDesk. We look forward to making your day beautiful.', W / 2, y, { align: 'center' })

  // ────────────────────────────────────────────────────────────────────────
  //  FOOTER BAR
  // ────────────────────────────────────────────────────────────────────────
  doc.setFillColor(...darkBrown)
  doc.rect(0, 281, W, 16, 'F')

  doc.setFillColor(...roseGold)
  doc.rect(0, 281, W, 1.5, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...roseGold)
  doc.text('MakeupDesk', M, 290)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(160, 135, 110)
  doc.text('Professional Makeup Artist Studio', M, 294)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(140, 115, 92)
  doc.text('This is a computer-generated quotation.', W - M, 292, { align: 'right' })

  const fileName = `Quote_${appt.id}_${(appt.name || 'Client').replace(/\s+/g, '_')}.pdf`
  if (!options?.skipSave) {
    doc.save(fileName)
  }
  const blob = doc.output('blob')
  const file = new File([blob], fileName, { type: 'application/pdf' })
  return { doc, fileName, blob, file }
}

