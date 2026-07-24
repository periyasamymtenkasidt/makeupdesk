import { Bell, Search, Menu } from 'lucide-react'
import { useState } from 'react'

export default function TopBar({ title, subtitle }) {
  const [search, setSearch] = useState('')

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: 'rgba(253,248,244,0.92)', backdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(201,149,108,0.12)',
      padding: '14px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
    }}>
      {/* Left */}
      <div>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 700,
                     color: '#2d1b2e', margin: 0, letterSpacing: '-0.02em' }}>
          {title ?? 'Dashboard'}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '12.5px', color: '#5a4253', margin: '2px 0 0', fontWeight: 450 }}>{subtitle}</p>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Avatar */}
        <div style={{
          width:'36px', height:'36px', borderRadius:'50%', flexShrink:0,
          background:'linear-gradient(135deg,#c9956c,#e8a4b8)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontWeight:600, fontSize:'14px', color:'white', cursor:'pointer',
        }}>
          A
        </div>
      </div>
    </header>
  )
}
