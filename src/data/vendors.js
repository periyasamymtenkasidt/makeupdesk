export const VENDOR_KEY = 'md_vendors'

export const ARTIST_CATEGORIES = ['Makeup Artist', 'Assistant Makeup Artist']

export const VENDOR_CATEGORIES = [
  'Makeup Artist',
  'Hair Stylist', 'Saree Draper', 'Costume Designer', 'Mehendi Artist',
  'Nail Artist', 'Photographer', 'Videographer', 'Assistant Makeup Artist', 'Other',
]

export const VENDOR_DEFAULTS = [
  // Makeup Artists (2)
  { id: 1,  name: 'Studio Artist',   category: 'Makeup Artist',           contact: '98765 00001', whatsapp: '98765 00001', charges: 2000, serviceArea: 'All Areas', availability: 'Available', rating: 5, notes: 'Main studio artist'            },
  { id: 8,  name: 'Divya Krishnan',  category: 'Makeup Artist',           contact: '98765 00008', whatsapp: '98765 00008', charges: 1800, serviceArea: 'All Areas', availability: 'Available', rating: 4, notes: 'Specializes in airbrush & HD'   },
  // Hair Stylists (2)
  { id: 2,  name: 'Preethi Nair',    category: 'Hair Stylist',            contact: '99887 11223', whatsapp: '99887 11223', charges: 2500, serviceArea: 'Chennai',   availability: 'Available', rating: 5, notes: 'Expert in bridal hair'         },
  { id: 9,  name: 'Sunitha Rajan',   category: 'Hair Stylist',            contact: '99887 11229', whatsapp: '99887 11229', charges: 2200, serviceArea: 'Chennai',   availability: 'Available', rating: 4, notes: 'Modern cuts & blow-dry styling' },
  // Saree Drapers (2)
  { id: 3,  name: 'Kavitha Menon',   category: 'Saree Draper',            contact: '88776 22334', whatsapp: '88776 22334', charges: 2000, serviceArea: 'Chennai',   availability: 'Available', rating: 4, notes: 'Specializes in silk sarees'   },
  { id: 10, name: 'Lakshmi Prasad',  category: 'Saree Draper',            contact: '88776 22310', whatsapp: '88776 22310', charges: 1800, serviceArea: 'Chennai',   availability: 'Available', rating: 4, notes: 'Kanjeevaram & designer drapes' },
  // Mehendi Artists (2)
  { id: 5,  name: 'Meena Iyer',      category: 'Mehendi Artist',          contact: '66554 44556', whatsapp: '66554 44556', charges: 2500, serviceArea: 'Chennai',   availability: 'Available', rating: 4, notes: 'Rajasthani & Arabic patterns'  },
  { id: 11, name: 'Fatima Shaikh',   category: 'Mehendi Artist',          contact: '66554 44511', whatsapp: '66554 44511', charges: 2200, serviceArea: 'Chennai',   availability: 'Available', rating: 4, notes: 'Intricate bridal mehendi'       },
  // Assistant Makeup Artists (2)
  { id: 7,  name: 'Anita Desai',     category: 'Assistant Makeup Artist', contact: '44332 66778', whatsapp: '44332 66778', charges: 2000, serviceArea: 'Chennai',   availability: 'Available', rating: 4, notes: 'Trained in HD & Airbrush'     },
  { id: 12, name: 'Rekha Pillai',    category: 'Assistant Makeup Artist', contact: '44332 66712', whatsapp: '44332 66712', charges: 1800, serviceArea: 'Chennai',   availability: 'Available', rating: 4, notes: 'Party & reception makeup'       },
  // Other crew
  { id: 4,  name: 'Rahul Sharma',    category: 'Photographer',            contact: '77665 33445', whatsapp: '77665 33445', charges: 1500, serviceArea: 'Chennai',   availability: 'Busy',      rating: 5, notes: 'Candid & portrait specialist'  },
  { id: 6,  name: 'Sundar Raj',      category: 'Videographer',            contact: '55443 55667', whatsapp: '55443 55667', charges: 2500, serviceArea: 'Chennai',   availability: 'Available', rating: 4, notes: 'Cinematic wedding films'       },
]
