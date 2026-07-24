import { useState } from 'react'

const INITIAL = {
  name: '', phone: '', service: '',
  date: '', shift: '', location: '', notes: '',
}

export function useBookingForm() {
  const [step, setStep]       = useState(1)
  const [form, setFormState]  = useState(INITIAL)

  const setField   = (key, value) => setFormState(f => ({ ...f, [key]: value }))
  const nextStep   = () => setStep(2)
  const prevStep   = () => setStep(1)
  const reset      = () => { setStep(1); setFormState(INITIAL) }

  const step1Valid = Boolean(form.name.trim() && form.phone.trim() && form.service)
  const step2Valid = Boolean(form.date && form.shift && form.location.trim())

  return { step, form, setField, nextStep, prevStep, reset, step1Valid, step2Valid }
}
