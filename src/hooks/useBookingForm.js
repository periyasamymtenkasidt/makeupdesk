import { useState } from 'react'

const INITIAL = {
  name: '', phone: '', service: '', addOns: ['Makeup Artist'],
  vendorId: '1', personCount: 1,
  date: '', time: '', locationType: 'Studio', venue: '', venueAddress: '', location: '', notes: '',
}

export function useBookingForm() {
  const [step, setStep]           = useState(1)
  const [form, setFormState]      = useState(INITIAL)
  const [step1Touched, setStep1Touched] = useState(false)

  const filterName  = v => v.replace(/[^a-zA-Z\s.'`-]/g, '')
  const filterPhone = v => v.replace(/[^0-9 ]/g, '').slice(0, 15)
  const setField = (key, value) =>
    setFormState(f => ({
      ...f,
      [key]: key === 'name'  ? filterName(value)
           : key === 'phone' ? filterPhone(value)
           : value,
    }))

  const step1Valid = Boolean(
    form.name.trim() &&
    form.phone.replace(/\s/g, '').length === 10 &&
    form.service
  )

  const nextStep = () => {
    if (!step1Valid) { setStep1Touched(true); return }
    setStep(2)
  }
  const prevStep = () => setStep(1)
  const reset    = () => { setStep(1); setFormState(INITIAL); setStep1Touched(false) }

  const isVenue = form.locationType === 'Venue'
  const step2Valid = Boolean(form.date && form.time && (!isVenue || form.venueAddress.trim()))

  return { step, form, setField, nextStep, prevStep, reset, step1Valid, step1Touched, step2Valid }
}
