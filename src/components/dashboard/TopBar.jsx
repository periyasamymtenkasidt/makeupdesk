import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon, Search, Sparkles, Menu } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import GlobalSearchModal from './GlobalSearchModal'

export default function TopBar({ onMenuToggle }) {
  const { theme, toggleTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)

  // Listen for Ctrl+K / Cmd+K to open search modal
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const iconBtn = {
    width: '34px', height: '34px', borderRadius: '50%',
    border: '1px solid var(--dash-border)',
    background: 'var(--dash-surface)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s ease', color: 'var(--dash-text-secondary)',
    flexShrink: 0,
  }

  return (
    <div style={{ padding: '10px 12px', flexShrink: 0 }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px', padding: '0 16px',
        background: 'var(--dash-card-bg)',
        border: '1px solid var(--dash-border)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px var(--dash-shadow), 0 1px 4px rgba(201, 149, 108, 0.1)',
      }}>

        {/* Brand & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onMenuToggle}
            className="sm:hidden flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              border: '1px solid var(--dash-border)',
              background: 'var(--dash-surface)',
              color: 'var(--dash-text-secondary)',
              flexShrink: 0,
            }}
            title="Open menu"
          >
            <Menu size={17} />
          </button>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #c9956c 0%, #e8a4b8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 3px 10px rgba(201, 149, 108, 0.4)',
            }}>
              <Sparkles size={14} color="white" />
            </div>
            <span style={{
              fontFamily: 'Playfair Display, serif', fontWeight: 600,
              fontSize: '18px', color: 'var(--dash-text-primary)',
              whiteSpace: 'nowrap',
            }}>
              MakeupDesk
            </span>
          </Link>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* Search Trigger Button */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '7px 14px', borderRadius: '10px',
              border: '1px solid var(--dash-border)', background: 'var(--dash-surface)',
              cursor: 'pointer', color: 'var(--dash-text-secondary)',
              fontSize: '12.5px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease',
            }}
            title="Search (Ctrl + K)"
          >
            <Search size={14} style={{ color: 'var(--icon-booking)' }} />
            <span className="hidden sm:inline" style={{ color: 'var(--dash-text-muted)' }}>Search...</span>
            <kbd className="hidden sm:inline-block" style={{
              fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
              border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)',
              color: 'var(--dash-text-muted)', letterSpacing: '0.04em',
            }}>
              Ctrl K
            </kbd>
          </button>

          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={iconBtn}
          >
            {theme === 'dark'
              ? <Sun size={15} style={{ color: '#f59e0b' }} />
              : <Moon size={15} style={{ color: 'var(--color-rose-gold)' }} />
            }
          </button>

          <div style={{ width: '1px', height: '28px', background: 'var(--dash-border)', margin: '0 6px' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--dash-text-primary)', lineHeight: 1.3 }}>
                Ananya
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--dash-text-muted)', lineHeight: 1.3 }}>
                Makeup Artist
              </p>
            </div>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #c9956c 0%, #e8a4b8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '13px', color: '#ffffff',
              boxShadow: '0 2px 8px rgba(201, 149, 108, 0.4)',
            }}>
              A
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
