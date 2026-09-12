import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const bg      = isDark ? '#0f0705'         : '#fdf8f4'
  const cardBg  = isDark ? 'rgba(22,12,8,0.97)' : 'rgba(253,248,244,0.98)'
  const border  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(201,149,108,0.2)'
  const heading = isDark ? '#ffffff'         : '#2d1b2e'
  const sub     = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(45,27,46,0.58)'

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '24px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        background: cardBg,
        border: `1px solid ${border}`,
        borderRadius: '24px',
        padding: '56px 48px',
        textAlign: 'center',
        maxWidth: '440px',
        width: '100%',
        boxShadow: isDark
          ? '0 32px 80px rgba(0,0,0,0.6)'
          : '0 32px 80px rgba(201,149,108,0.15)',
      }}>

        {/* Glam icon */}
        <div style={{
          width: 72, height: 72, borderRadius: '20px', margin: '0 auto 24px',
          background: 'linear-gradient(135deg, rgba(201,149,108,0.18) 0%, rgba(212,114,143,0.18) 100%)',
          border: `1.5px solid ${border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '34px',
        }}>
          ✨
        </div>

        {/* 404 number */}
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '80px',
          fontWeight: 700,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #c9956c 0%, #d4728f 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '12px',
          letterSpacing: '-0.03em',
        }}>
          404
        </div>

        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '22px', fontWeight: 700,
          color: heading, margin: '0 0 10px',
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: '14px', color: sub,
          lineHeight: 1.6, margin: '0 0 32px',
        }}>
          Looks like this page went off-script. The URL you visited doesn't exist.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button variant="primary" size="md" fullWidth onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="outline" size="md" fullWidth onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
