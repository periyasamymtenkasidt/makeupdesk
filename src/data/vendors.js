export const VENDOR_KEY = 'md_vendors'

export const ARTIST_CATEGORIES = ['Makeup Artist', 'Assistant Makeup Artist']

export const VENDOR_CATEGORIES = [
  'Makeup Artist',
  'Hair Stylist', 'Saree Draper', 'Costume Designer', 'Mehendi Artist',
  'Nail Artist', 'Photographer', 'Videographer', 'Assistant Makeup Artist', 'Other',
]

export const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const VENDOR_DEFAULTS = [
  { id: 1, name: 'Studio Artist',  category: 'Makeup Artist',           contact: '98765 00001', whatsapp: '98765 00001', charges: 2000, serviceArea: 'All Areas', availability: 'Available', rating: 5, notes: 'Main studio artist',          workDays: ['Mon','Tue','Wed','Thu','Fri','Sat'], shiftStart: '07:00', shiftEnd: '20:00' },
  { id: 2, name: 'Preethi Nair',   category: 'Hair Stylist',            contact: '99887 11223', whatsapp: '99887 11223', charges: 2500, serviceArea: 'Chennai',   availability: 'Available', rating: 5, notes: 'Expert in bridal hair',       workDays: ['Mon','Tue','Wed','Thu','Fri','Sat'], shiftStart: '08:00', shiftEnd: '19:00' },
  { id: 3, name: 'Kavitha Menon',  category: 'Saree Draper',            contact: '88776 22334', whatsapp: '88776 22334', charges: 2000, serviceArea: 'Chennai',   availability: 'Available', rating: 4, notes: 'Specializes in silk sarees', workDays: ['Mon','Wed','Fri','Sat','Sun'],       shiftStart: '09:00', shiftEnd: '18:00' },
  { id: 4, name: 'Rahul Sharma',   category: 'Photographer',            contact: '77665 33445', whatsapp: '77665 33445', charges: 1500, serviceArea: 'Chennai',   availability: 'Busy',      rating: 5, notes: 'Candid & portrait specialist',workDays: ['Thu','Fri','Sat','Sun'],             shiftStart: '10:00', shiftEnd: '20:00' },
  { id: 5, name: 'Meena Iyer',     category: 'Mehendi Artist',          contact: '66554 44556', whatsapp: '66554 44556', charges: 2500, serviceArea: 'Chennai',   availability: 'Available', rating: 4, notes: 'Rajasthani & Arabic patterns',workDays: ['Tue','Wed','Thu','Fri','Sat'],       shiftStart: '09:00', shiftEnd: '21:00' },
  { id: 6, name: 'Sundar Raj',     category: 'Videographer',            contact: '55443 55667', whatsapp: '55443 55667', charges: 2500, serviceArea: 'Chennai',   availability: 'Available', rating: 4, notes: 'Cinematic wedding films',     workDays: ['Fri','Sat','Sun'],                   shiftStart: '08:00', shiftEnd: '20:00' },
  { id: 7, name: 'Anita Desai',    category: 'Assistant Makeup Artist', contact: '44332 66778', whatsapp: '44332 66778', charges: 2000, serviceArea: 'Chennai',   availability: 'Available', rating: 4, notes: 'Trained in HD & Airbrush',   workDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], shiftStart: '06:00', shiftEnd: '21:00' },
]
