export const NAV_LINKS = [
  { label: 'Home',          href: '#home' },
  { label: 'Services',      href: '#services' },
  { label: 'How It Works',  href: '#how-it-works' },
  { label: 'Portfolio',     href: '#portfolio' },
  { label: 'Testimonials',  href: '#testimonials' },
]

export const SHIFTS = [
  'Morning (6 AM – 10 AM)',
  'Afternoon (11 AM – 3 PM)',
  'Evening (4 PM – 8 PM)',
]

export const BOOKING_SHIFTS = [
  { value: '05:30 AM', label: '05:30 AM · Morning Muhurtham' },
  { value: '07:00 AM', label: '07:00 AM · Early Morning'     },
  { value: '10:00 AM', label: '10:00 AM · Morning Batch'     },
  { value: '02:00 PM', label: '02:00 PM · Afternoon Session' },
  { value: '06:00 PM', label: '06:00 PM · Evening Glam'      },
]

export const FOOTER_SERVICES = [
  'Bridal Makeup', 'Party Makeup', 'HD Makeup',
  'Airbrush Makeup', 'Pre-Wedding Shoot', 'Editorial Makeup',
]

export const APPOINTMENT_PIPELINE = [
  'Inquiry', 'Shift Reserved', 'Quotation Sent', 'Approved',
  'Payment Pending', 'Advance Paid', 'Confirmed',
  'In Progress', 'Completed', 'Balance Paid', 'Closed',
]

// Guided pipeline: each status maps to the one next action the artist should take
export const PIPELINE_NEXT = {
  'Inquiry':         { label: 'Send Quote',        action: 'send-quote'      },
  'Shift Reserved':  { label: 'Send Quote',        action: 'send-quote'      },
  'Quotation Sent':  { label: 'Approve Quote',     action: 'approve-quote'   },
  'Approved':        { label: 'Collect Advance',   action: 'collect-advance' },
  'Payment Pending': { label: 'Mark Advance Paid', action: 'collect-advance' },
  'Advance Paid':    { label: 'Confirm Slot',      action: 'confirm-slot'    },
  'Confirmed':       { label: 'Mark as Done',      action: 'mark-done'       },
  'In Progress':     { label: 'Mark as Done',      action: 'mark-done'       },
}

export const TERMINAL_STATUSES = new Set(['Completed', 'Balance Paid', 'Closed', 'Rejected', 'Expired'])

export const STATUS_CONFIG = {
  'Inquiry':         { color: 'var(--badge-inquiry)',   bg: 'var(--badge-inquiry-bg)'   },
  'Shift Reserved':  { color: 'var(--badge-reserved)',  bg: 'var(--badge-reserved-bg)'  },
  'Quotation Sent':  { color: 'var(--badge-sent)',      bg: 'var(--badge-sent-bg)'      },
  'Approved':        { color: 'var(--badge-confirmed)', bg: 'var(--badge-confirmed-bg)' },
  'Payment Pending': { color: 'var(--badge-pending)',   bg: 'var(--badge-pending-bg)'   },
  'Advance Paid':    { color: 'var(--badge-advance)',   bg: 'var(--badge-advance-bg)'   },
  'Confirmed':       { color: 'var(--badge-confirmed)', bg: 'var(--badge-confirmed-bg)' },
  'In Progress':     { color: 'var(--badge-inquiry)',   bg: 'var(--badge-inquiry-bg)'   },
  'Completed':       { color: 'var(--badge-confirmed)', bg: 'var(--badge-confirmed-bg)' },
  'Balance Paid':    { color: 'var(--badge-confirmed)', bg: 'var(--badge-confirmed-bg)' },
  'Closed':          { color: 'var(--badge-closed)',    bg: 'var(--badge-closed-bg)'    },
  'Rejected':        { color: 'var(--badge-rejected)',  bg: 'var(--badge-rejected-bg)'  },
  'Expired':         { color: 'var(--badge-closed)',    bg: 'var(--badge-closed-bg)'    },
}
