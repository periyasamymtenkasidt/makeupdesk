import { useState } from 'react'

const INITIAL = {
  name: '', phone: '', service: '', addOns: ['Makeup Artist'],
  vendorId: '1', personCount: 1,
  date: '', time: '', locationType: 'Studio', venue: '', venueAddress: '', location: '', notes: '',
}

export function useBookingForm() {
  const [form,    setFormState] = useState(INITIAL)
  const [touched, setTouched]  = useState(false)

  const filterName  = v => v.replace(/[^a-zA-Z\s.'`-]/g, '')
  const filterPhone = v => v.replace(/[^0-9 ]/g, '').slice(0, 15)

  const setField = (key, value) =>
    setFormState(f => ({
      ...f,
      [key]: key === 'name'  ? filterName(value)
           : key === 'phone' ? filterPhone(value)
           : value,
    }))

  const isVenue   = form.locationType === 'Venue'
  const formValid = Boolean(
    form.name.trim() &&
    form.phone.replace(/\s/g, '').length === 10 &&
    form.service &&
    form.date &&
    form.time &&
    (!isVenue || form.venueAddress.trim())
  )

  const reset = () => { setFormState(INITIAL); setTouched(false) }

  return { form, setField, reset, formValid, touched, setTouched }
}
