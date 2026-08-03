import { useState, useEffect } from 'react'

const KEY = 'md_settings'

const DEFAULT_SETTINGS = {
  // Studio Profile
  studioName:  'Ananya Makeup Studio',
  artistName:  'Ananya Roy',
  tagline:     'Certified Luxury Bridal & Editorial Artist',
  phone:       '98765 43210',
  email:       'ananya@makeupdesk.com',
  address:     'Studio #204, Chennai, TN- 600001',
  gstin:       '27AABCU9603R1ZM',

  // Payments & UPI
  upiId:       'ananyamakeup@upi',
  qrCodeImage: '',
  bankName:    'HDFC Bank Ltd.',
  accountNo:   '50100293847561',
  ifscCode:    'HDFC0001234',
  advancePct:  40,

  // WhatsApp Templates
  quoteTemplate:   "Hi {client}! Here is your personalized quotation for {service} on {date}: ₹{amount}. Let us know if you'd like to lock your slot!",
  confirmTemplate: "Hi {client}! Your booking for {service} on {date} at {time} is confirmed 🎉. We look forward to creating your glam look!",
  receiptTemplate: "Hi {client}! We received your advance payment of ₹{advance}. Thank you! Remaining balance: ₹{balance}.",

  // Preferences & Alerts
  leadAlerts:    true,
  allergyAlerts: true,
  autoReminders: true,
  bookingBuffer: 60,

  // Landing Page Stats
  clientCount:  500,
  yearsExp:     8,
  eventsCount:  1000,
  rating:       4.9,
}

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY)
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings))
    } catch (e) {
      console.error('Failed to save settings to localStorage', e)
    }
  }, [settings])

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return { settings, updateSettings, resetSettings }
}
