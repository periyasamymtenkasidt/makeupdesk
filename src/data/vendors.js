export const VENDOR_KEY = 'md_vendors'

export const ARTIST_CATEGORIES = ['Makeup Artist', 'Assistant Makeup Artist']

export const VENDOR_CATEGORIES = [
  'Makeup Artist',
  'Hair Stylist', 'Saree Draper', 'Costume Designer', 'Mehendi Artist',
  'Nail Artist', 'Photographer', 'Videographer', 'Assistant Makeup Artist', 'Other',
]

export const VENDOR_DEFAULTS = [
  { id: 1, name: 'Studio Artist',  category: 'Makeup Artist',           contact: '+91 98765 00001', whatsapp: '+91 98765 00001', charges: 0,     serviceArea: 'All Areas',     availability: 'Available', rating: 5, notes: 'Main studio artist' },
  { id: 2, name: 'Preethi Nair',   category: 'Hair Stylist',            contact: '+91 99887 11223', whatsapp: '+91 99887 11223', charges: 2500,  serviceArea: 'Mumbai',        availability: 'Available', rating: 5, notes: 'Expert in bridal hair' },
  { id: 3, name: 'Kavitha Menon',  category: 'Saree Draper',            contact: '+91 88776 22334', whatsapp: '+91 88776 22334', charges: 1500,  serviceArea: 'Mumbai',        availability: 'Available', rating: 4, notes: 'Specializes in silk sarees' },
  { id: 4, name: 'Rahul Sharma',   category: 'Photographer',            contact: '+91 77665 33445', whatsapp: '+91 77665 33445', charges: 15000, serviceArea: 'Mumbai, Delhi', availability: 'Busy',      rating: 5, notes: 'Candid & portrait specialist' },
  { id: 5, name: 'Meena Iyer',     category: 'Mehendi Artist',          contact: '+91 66554 44556', whatsapp: '+91 66554 44556', charges: 3000,  serviceArea: 'Mumbai',        availability: 'Available', rating: 4, notes: 'Rajasthani & Arabic patterns' },
  { id: 6, name: 'Sundar Raj',     category: 'Videographer',            contact: '+91 55443 55667', whatsapp: '+91 55443 55667', charges: 12000, serviceArea: 'Mumbai',        availability: 'Available', rating: 4, notes: 'Cinematic wedding films' },
  { id: 7, name: 'Anita Desai',    category: 'Assistant Makeup Artist', contact: '+91 44332 66778', whatsapp: '+91 44332 66778', charges: 2000,  serviceArea: 'Mumbai, Pune',  availability: 'Available', rating: 4, notes: 'Trained in HD & Airbrush' },
]
