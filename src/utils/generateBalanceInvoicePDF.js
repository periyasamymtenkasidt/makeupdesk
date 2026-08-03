import { jsPDF } from 'jspdf'
import { formatCurrency } from './formatCurrency'

function safe(str = '') {
  return str.replace(/[^\x00-\xFF]/g, '')
}

function rupee(amount) {
  return formatCurrency(amount).replace('₹', 'Rs. ')
}

export async function generateBalanceInvoicePDF(appt, options = {}) {
  const doc  = new jsPDF({ unit: 'mm', format: 'a4' })
  const W    = 210
  const M    = 20          // margin
  const CW   = W - M * 2  // content width

  // Read settings for UPI & QR Code
  let upiId = 'makeupdesk@upi'
  let qrCodeImage = ''
  let studioName = 'MakeupDesk'
  let tagline = 'Professional Makeup Artist Studio'

  try {
    const saved = JSON.parse(localStorage.getItem('md_settings') || '{}')
    if (saved.upiId)       upiId      = saved.upiId
    if (saved.qrCodeImage) qrCodeImage = saved.qrCodeImage
    if (saved.studioName)  studioName = saved.studioName
    if (saved.tagline)     tagline    = saved.tagline
  } catch (e) {
    console.error(e)
  }

  const totalAmount  = Number(appt.amount || 0)
  const advanceAmount = appt.advancePaid ? Number(appt.advanceAmount || 0) : 0
  const balanceDue   = Math.max(0, totalAmount - advanceAmount)

  let qrBase64 = null
  const qrUrl = qrCodeImage || (upiId ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${studioName}&am=${balanceDue}&cu=INR`)}` : '')

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

  // ────────────────────────────────────────────────────────────────────────
  //  HEADER
  // ────────────────────────────────────────────────────────────────────────
  doc.setFillColor(...darkBrown)
  doc.rect(0, 0, W, 46, 'F')

  doc.setFillColor(...roseGold)
  doc.rect(0, 46, W, 2.5, 'F')

  doc.setFont('times', 'bolditalic')
  doc.setFontSize(30)
  doc.setTextColor(255, 245, 230)
  doc.text(safe(studioName), M, 23)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...roseMid)
  doc.text(safe(tagline), M, 31)

  doc.setFillColor(...roseGold)
  ;[0, 5, 10].forEach(offset => doc.circle(M + offset, 38.5, 0.8, 'F'))

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...roseGold)
  doc.text('BALANCE INVOICE', W - M, 19, { align: 'right' })

  doc.setFont('courier', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(210, 185, 155)
  doc.text(`# INV-${appt.id}`, W - M, 28, { align: 'right' })

  const issued = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(160, 135, 110)
  doc.text(`Date: ${issued}`, W - M, 37, { align: 'right' })

  // ────────────────────────────────────────────────────────────────────────
  //  CLIENT & SERVICE BLOCK
  // ────────────────────────────────────────────────────────────────────────
  let y = 60

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...textMuted)
  doc.text('BILL TO', M, y)

  doc.setFont('times', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...textDark)
  doc.text(safe(appt.name), M, y + 9)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...textMuted)
  doc.text(appt.phone || '', M, y + 16)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...textMuted)
  doc.text('SERVICE', W - M, y, { align: 'right' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...textDark)
  doc.text(safe(appt.service || 'Bridal Makeup'), W - M, y + 8, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...textMuted)
  doc.text(`Event Date: ${appt.date || '—'}`, W - M, y + 15, { align: 'right' })

  y += 26

  // ────────────────────────────────────────────────────────────────────────
  //  FINANCIAL STATEMENT TABLE
  // ────────────────────────────────────────────────────────────────────────
  doc.setFillColor(...cream)
  doc.rect(M, y, CW, 9, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...textMuted)
  doc.text('DESCRIPTION', M + 5, y + 6)
  doc.text('AMOUNT', W - M - 5, y + 6, { align: 'right' })

  y += 9

  const ledger = [
    ['Total Service Package Amount', rupee(totalAmount)],
    ['Advance Deposit Received', advanceAmount > 0 ? `- ${rupee(advanceAmount)}` : 'Rs. 0'],
  ]

  ledger.forEach(([label, val], idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(...offWhite)
      doc.rect(M, y, CW, 9, 'F')
    }
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(...textDark)
    doc.text(label, M + 5, y + 6)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.text(safe(val), W - M - 5, y + 6, { align: 'right' })

    y += 9
  })

  // ────────────────────────────────────────────────────────────────────────
  //  BALANCE DUE HIGHLIGHT BOX
  // ────────────────────────────────────────────────────────────────────────
  y += 6

  doc.setFillColor(170, 120, 80)
  doc.roundedRect(M + 1, y + 1, CW, 24, 4, 4, 'F')

  doc.setFillColor(...roseGold)
  doc.roundedRect(M, y, CW, 24, 4, 4, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 230, 200)
  doc.text('REMAINING BALANCE DUE', M + 10, y + 8)

  doc.setFont('times', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(...white)
  doc.text(rupee(balanceDue), M + 10, y + 19)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(255, 225, 190)
  doc.text('Payable via UPI or Cash', W - M - 10, y + 18, { align: 'right' })

  y += 30

  // ────────────────────────────────────────────────────────────────────────
  //  UPI PAYMENT QR CODE BOX
  // ────────────────────────────────────────────────────────────────────────
  const payH = 34
  doc.setFillColor(...cream)
  doc.setDrawColor(...roseGold)
  doc.setLineWidth(0.5)
  doc.roundedRect(M, y, CW, payH, 4, 4, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...roseGold)
  doc.text('PAYMENT DETAILS', M + 8, y + 8)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...textDark)
  doc.text(`Balance Payable: ${rupee(balanceDue)}`, M + 8, y + 16)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(160, 95, 45)
  doc.text(`UPI ID / VPA: ${upiId}`, M + 8, y + 23)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...textMuted)
  doc.text('Scan QR code or use UPI ID to settle the balance payment.', M + 8, y + 29)

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

  y += payH + 12

  doc.setFont('times', 'italic')
  doc.setFontSize(11)
  doc.setTextColor(...roseMid)
  doc.text('Thank you for trusting MakeupDesk for your special event!', W / 2, y, { align: 'center' })

  // Footer
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
  doc.text('Computer-generated Balance Invoice.', W - M, 292, { align: 'right' })

  const fileName = `Balance_Invoice_${appt.id}_${(appt.name || 'Client').replace(/\s+/g, '_')}.pdf`
  if (!options?.skipSave) {
    doc.save(fileName)
  }
  const blob = doc.output('blob')
  const file = new File([blob], fileName, { type: 'application/pdf' })
  return { doc, fileName, blob, file }
}
