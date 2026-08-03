import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft,
  CheckCircle2, AlertCircle, X, ShieldCheck, Zap, Star,
  KeyRound, RefreshCw, Building2, User, BellRing, Award, Sun, Moon
} from 'lucide-react'
import bridePic from '../assets/images/Bride_1.png'
import { CustomSelect } from '../components/ui/CustomSelect'
import { useTheme } from '../context/ThemeContext'

const LIVE_NOTIFICATIONS = [
  { text: '✨ New Bridal Booking: Full Glam Package • ₹12,000 Advance Paid', time: 'Just now' },
  { text: '📄 Quotation Accepted: Priya S. • ₹8,500 Rate Card Approved',     time: '3m ago'  },
  { text: '⭐ New 5-Star Review: "Best bridal artist in Chennai — flawless!"', time: '8m ago'  },
  { text: '💳 UPI Advance Received: ₹4,500 from Anjali Mehta',               time: '15m ago' },
]

const PLATFORM_STATS = [
  { value: '1,200+',  label: 'Bookings',  color: '#c9956c' },
  { value: '₹2.4Cr+', label: 'Revenue',  color: '#e8a4b8' },
  { value: '98.5%',   label: 'Retention', color: '#c4a06e' },
]

export default function Login() {
  const navigate = useNavigate()
  const rightPanelRef = useRef(null)
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  /* ── Theme token map ── */
  const T = isDark ? {
    panelBg:       'linear-gradient(160deg, #0f0705 0%, #160c08 45%, #1c1009 100%)',
    cardBg:        'rgba(14,8,5,0.97)',
    cardShadow:    '0 32px 80px rgba(0,0,0,0.7)',
    heading:       '#ffffff',
    sub:           'rgba(255,255,255,0.36)',
    muted:         'rgba(255,255,255,0.50)',
    dim:           'rgba(255,255,255,0.28)',
    faint:         'rgba(255,255,255,0.44)',
    vfaint:        'rgba(255,255,255,0.20)',
    label:         'rgba(255,255,255,0.50)',
    iconMuted:     'rgba(255,255,255,0.28)',
    tabBg:         'rgba(255,255,255,0.04)',
    tabBorder:     '1px solid rgba(255,255,255,0.07)',
    divider:       '1px solid rgba(255,255,255,0.07)',
    cardFooter:    '1px solid rgba(255,255,255,0.06)',
    toggleBg:      'rgba(255,255,255,0.08)',
    toggleHover:   'rgba(255,255,255,0.16)',
    toggleColor:   'rgba(255,255,255,0.75)',
    otpBg:         'rgba(255,255,255,0.07)',
    otpBorder:     'rgba(255,255,255,0.14)',
    strengthEmpty: 'rgba(255,255,255,0.06)',
    mobileHdrBorder:'rgba(255,255,255,0.06)',
    modalOverlay:  'rgba(6,3,10,0.88)',
    modalBg:       'rgba(18,10,22,0.98)',
    modalBorder:   '1px solid rgba(255,255,255,0.12)',
    avatarBorder:  'rgba(14,8,5,0.9)',
    inputBg:       'rgba(255,255,255,0.06)',
    inputBorder:   '1px solid rgba(255,255,255,0.10)',
    inputText:     '#ffffff',
  } : {
    panelBg:       'linear-gradient(160deg, #fdf8f4 0%, #f5e8de 45%, #ede0d6 100%)',
    cardBg:        'rgba(253,248,244,0.98)',
    cardShadow:    '0 32px 80px rgba(201,149,108,0.18)',
    heading:       '#2d1b2e',
    sub:           'rgba(45,27,46,0.58)',
    muted:         'rgba(45,27,46,0.55)',
    dim:           'rgba(45,27,46,0.42)',
    faint:         'rgba(45,27,46,0.50)',
    vfaint:        'rgba(45,27,46,0.32)',
    label:         '#8b5a2b',
    iconMuted:     'rgba(45,27,46,0.32)',
    tabBg:         'rgba(45,27,46,0.05)',
    tabBorder:     '1px solid rgba(45,27,46,0.10)',
    divider:       '1px solid rgba(45,27,46,0.10)',
    cardFooter:    '1px solid rgba(45,27,46,0.08)',
    toggleBg:      'rgba(45,27,46,0.08)',
    toggleHover:   'rgba(45,27,46,0.14)',
    toggleColor:   'rgba(45,27,46,0.70)',
    otpBg:         'rgba(45,27,46,0.05)',
    otpBorder:     'rgba(45,27,46,0.18)',
    strengthEmpty: 'rgba(45,27,46,0.08)',
    mobileHdrBorder:'rgba(45,27,46,0.08)',
    modalOverlay:  'rgba(45,27,46,0.55)',
    modalBg:       'rgba(253,248,244,0.98)',
    modalBorder:   '1px solid rgba(201,149,108,0.28)',
    avatarBorder:  'rgba(253,248,244,0.95)',
    inputBg:       'rgba(45,27,46,0.04)',
    inputBorder:   '1px solid rgba(45,27,46,0.14)',
    inputText:     '#2d1b2e',
  }

  const inputStyle = { background: T.inputBg, border: T.inputBorder, color: T.inputText }

  const [mousePos, setMousePos]       = useState({ x: 0, y: 0 })
  const [authMode, setAuthMode]       = useState('signin')
  const [notifIndex, setNotifIndex]   = useState(0)
  const [mounted, setMounted]         = useState(false)

  const [email, setEmail]                   = useState('')
  const [password, setPassword]             = useState('')
  const [showPassword, setShowPassword]     = useState(false)
  const [rememberMe, setRememberMe]         = useState(true)
  const [isSubmitting, setIsSubmitting]     = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const [regStudioName, setRegStudioName] = useState('')
  const [regFullName, setRegFullName]     = useState('')
  const [regEmail, setRegEmail]           = useState('')
  const [regPassword, setRegPassword]     = useState('')
  const [regSpecialty, setRegSpecialty]   = useState('Bridal & Glam')

  const [errorMessage, setErrorMessage] = useState('')
  const [toastMessage, setToastMessage] = useState(null)

  const [isForgotOpen, setIsForgotOpen]       = useState(false)
  const [forgotStep, setForgotStep]           = useState(1)
  const [forgotEmail, setForgotEmail]         = useState('')
  const [otp, setOtp]                         = useState(['', '', '', ''])
  const [resendTimer, setResendTimer]         = useState(45)
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [forgotLoading, setForgotLoading]     = useState(false)
  const [forgotError, setForgotError]         = useState('')

  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setNotifIndex(p => (p + 1) % LIVE_NOTIFICATIONS.length), 4500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    let interval = null
    if (isForgotOpen && forgotStep === 2 && resendTimer > 0) {
      interval = setInterval(() => setResendTimer(p => p - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isForgotOpen, forgotStep, resendTimer])

  const handleMouseMove = (e) => {
    if (!rightPanelRef.current) return
    const rect = rightPanelRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const fillDemoCredentials = () => {
    setAuthMode('signin')
    setEmail('studio.artist@makeupdesk.in')
    setPassword('MakeupArtist2026!')
    setErrorMessage('')
    showToast('Demo credentials loaded! Click "Sign In" to proceed.')
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault(); setErrorMessage('')
    if (!email.trim() || !email.includes('@')) { setErrorMessage('Please enter a valid email address.'); return }
    if (!password) { setErrorMessage('Please enter your account password.'); return }
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      showToast('Welcome back! Loading your studio dashboard…')
      setTimeout(() => navigate('/dashboard'), 1000)
    }, 1200)
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault(); setErrorMessage('')
    if (!regStudioName.trim()) { setErrorMessage('Please enter your studio name.'); return }
    if (!regEmail.includes('@')) { setErrorMessage('Please enter a valid email address.'); return }
    if (regPassword.length < 8) { setErrorMessage('Password must be at least 8 characters long.'); return }
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      showToast(`🎉 Studio "${regStudioName}" created! Redirecting to setup…`)
      setTimeout(() => navigate('/dashboard'), 1200)
    }, 1400)
  }

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true); setErrorMessage('')
    setTimeout(() => {
      setIsGoogleLoading(false)
      showToast('Authenticated via Google!')
      setTimeout(() => navigate('/dashboard'), 1100)
    }, 1400)
  }

  const handleSendOtp = (e) => {
    e.preventDefault(); setForgotError('')
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) { setForgotError('Please enter a valid email address.'); return }
    setForgotLoading(true)
    setTimeout(() => { setForgotLoading(false); setForgotStep(2); setResendTimer(45); setTimeout(() => otpInputRefs[0].current?.focus(), 100) }, 1000)
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1]
    const newOtp = [...otp]; newOtp[index] = value; setOtp(newOtp)
    if (value && index < 3) otpInputRefs[index + 1].current?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpInputRefs[index - 1].current?.focus()
  }

  const fillDemoOtp = () => { setOtp(['4', '8', '2', '9']); setForgotError('') }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    if (otp.join('').length < 4) { setForgotError('Please enter all 4 digits.'); return }
    setForgotLoading(true)
    setTimeout(() => { setForgotLoading(false); setForgotError(''); setForgotStep(3) }, 1000)
  }

  const getPasswordStrength = (pass) => {
    let s = 0
    if (pass.length >= 8) s++
    if (/[0-9]/.test(pass)) s++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) s++
    if (/[A-Z]/.test(pass)) s++
    return s
  }
  const strengthScore = getPasswordStrength(newPassword)

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault(); setForgotError('')
    if (newPassword.length < 8) { setForgotError('Password must be at least 8 characters.'); return }
    if (newPassword !== confirmPassword) { setForgotError('Passwords do not match.'); return }
    setForgotLoading(true)
    setTimeout(() => { setForgotLoading(false); setForgotStep(4); setAuthMode('signin'); setEmail(forgotEmail); setPassword(newPassword) }, 1200)
  }

  const closeForgotModal = () => {
    setIsForgotOpen(false); setForgotStep(1); setForgotEmail('')
    setOtp(['', '', '', '']); setNewPassword(''); setConfirmPassword(''); setForgotError('')
  }

  const currentNotif = LIVE_NOTIFICATIONS[notifIndex]
  const inputCls = 'w-full rounded-xl text-sm focus:outline-none focus:border-[#c9956c] focus:ring-2 focus:ring-[#c9956c]/20 transition-all duration-200'

  /* ─────────────────────────────────────────────────── */
  return (
    <div className="h-screen flex overflow-hidden font-sans text-white">

      {/* ══════════════════════════════════════════════════
          LEFT — Bride Image Panel (intentionally always dark)
      ══════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col flex-shrink-0 overflow-hidden"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(-28px)',
          transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={bridePic}
            alt="Bridal beauty"
            className="w-full h-full object-cover animate-ken-burns"
            style={{ objectPosition: 'center 8%' }}
          />
        </div>

        <div className="absolute inset-0" style={{
          background: isDark
            ? 'linear-gradient(to right, rgba(5,2,9,0.92) 0%, rgba(5,2,9,0.70) 32%, rgba(5,2,9,0.22) 62%, rgba(5,2,9,0.06) 100%)'
            : 'linear-gradient(to right, rgba(5,2,9,0.52) 0%, rgba(5,2,9,0.38) 32%, rgba(5,2,9,0.12) 62%, rgba(5,2,9,0.02) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(5,2,9,0.75) 0%, transparent 20%, transparent 52%, rgba(5,2,9,0.82) 100%)'
            : 'linear-gradient(to bottom, rgba(5,2,9,0.38) 0%, transparent 20%, transparent 52%, rgba(5,2,9,0.45) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(120deg, transparent 40%, rgba(201,149,108,0.08) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: isDark
            ? 'radial-gradient(ellipse at 72% 48%, transparent 42%, rgba(5,2,9,0.52) 100%)'
            : 'radial-gradient(ellipse at 72% 48%, transparent 42%, rgba(5,2,9,0.18) 100%)'
        }} />

        <div className="absolute top-0 right-0 w-px h-full z-20 pointer-events-none"
             style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(201,149,108,0.35) 20%, rgba(201,149,108,0.55) 50%, rgba(201,149,108,0.35) 80%, transparent 100%)' }} />

        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px', opacity: 0.032, mixBlendMode: 'overlay'
        }} />

        {/* Floating badge: booking */}
        <div className="absolute pointer-events-none animate-float-card"
             style={{ top: '9%', right: '4%', transform: 'rotate(-1.5deg)' }}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{
            background: isDark ? 'rgba(12,6,16,0.9)' : 'rgba(20,10,8,0.72)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(201,149,108,0.5)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,149,108,0.1), 0 8px 32px rgba(201,149,108,0.18), inset 0 1px 0 rgba(255,255,255,0.09)',
            minWidth: '215px',
          }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg, #c9956c, #d4728f)', boxShadow: '0 4px 14px rgba(201,149,108,0.55)' }}>
              <BellRing size={15} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#34d399' }} />
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#c9956c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Just now</span>
              </div>
              <p className="text-white font-semibold leading-none" style={{ fontSize: '12px' }}>New Bridal Booking</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '3px' }}>₹12,000 advance received</p>
            </div>
          </div>
        </div>

        {/* Floating badge: rating */}
        <div className="absolute pointer-events-none animate-float-card2"
             style={{ top: '40%', right: '24%', transform: 'rotate(1.8deg)' }}>
          <div className="px-4 py-3.5 rounded-2xl text-center" style={{
            background: isDark ? 'rgba(12,6,16,0.9)' : 'rgba(20,10,8,0.72)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(232,164,184,0.45)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(232,164,184,0.08), 0 8px 32px rgba(232,164,184,0.15), inset 0 1px 0 rgba(255,255,255,0.09)',
            minWidth: '118px',
          }}>
            <div className="flex justify-center gap-0.5 mb-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
            </div>
            <div className="font-display font-bold text-white" style={{ fontSize: '26px', lineHeight: 1 }}>4.9</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginTop: '5px' }}>1,200+ Reviews</div>
          </div>
        </div>

        {/* Floating badge: revenue */}
        <div className="absolute pointer-events-none animate-float-card3"
             style={{ top: '68%', right: '6%', transform: 'rotate(-1deg)' }}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{
            background: isDark ? 'rgba(12,6,16,0.9)' : 'rgba(20,10,8,0.72)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(196,160,110,0.32)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(196,160,110,0.08), 0 8px 32px rgba(196,160,110,0.12), inset 0 1px 0 rgba(255,255,255,0.09)',
            minWidth: '178px',
          }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background: 'rgba(196,160,110,0.12)', border: '1px solid rgba(196,160,110,0.3)' }}>
              <Award size={16} style={{ color: '#c4a06e' }} />
            </div>
            <div>
              <div className="font-display font-bold" style={{ fontSize: '17px', color: '#c4a06e', lineHeight: 1 }}>₹2.4Cr+</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>Revenue managed</div>
            </div>
          </div>
        </div>

        {/* Content layer */}
        <div className="relative z-10 flex flex-col h-full px-10 xl:px-14 py-7 justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #c9956c, #e8a4b8)', boxShadow: '0 4px 18px rgba(201,149,108,0.5)' }}>
                <Sparkles size={17} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>MakeupDesk</span>
            </div>
            <Link to="/" className="flex items-center gap-1.5 text-xs font-medium no-underline transition-colors"
                  style={{ color: 'rgba(255,255,255,0.42)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.92)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.42)'}>
              <ArrowLeft size={13} />Back to site
            </Link>
          </div>

          <div className="max-w-sm">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-3"
                 style={{ background: 'rgba(201,149,108,0.18)', border: '1px solid rgba(201,149,108,0.42)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#c9956c' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#e8c4a0', letterSpacing: '0.12em', textTransform: 'uppercase' }}>India's #1 Studio CRM</span>
            </div>
            <h1 className="font-display text-white" style={{ fontSize: 'clamp(22px, 2.2vw, 32px)', fontWeight: 800, lineHeight: 1.15, textShadow: '0 2px 14px rgba(0,0,0,0.65)' }}>
              Your beauty studio,{' '}
              <span className="gradient-text italic">brilliantly managed.</span>
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)', maxWidth: '320px', textShadow: '0 1px 6px rgba(0,0,0,0.55)' }}>
              Manage bridal bookings, send WhatsApp quotations &amp; track UPI payments — all in one place.
            </p>
            <div className="mt-3 flex items-start gap-3 p-3.5 rounded-2xl max-w-xs"
                 style={{ background: isDark ? 'rgba(14,8,4,0.78)' : 'rgba(14,8,4,0.62)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                   style={{ background: 'linear-gradient(135deg, #c9956c, #d4728f)' }}>
                <BellRing size={13} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#c9956c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Activity</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>{currentNotif.time}</span>
                </div>
                <p className="text-white leading-snug" style={{ fontSize: '11px' }}>{currentNotif.text}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              {PLATFORM_STATS.map(({ value, label, color }) => (
                <div key={label} className="flex-1 rounded-2xl p-3.5 text-center"
                     style={{ background: isDark ? 'rgba(14,8,4,0.78)' : 'rgba(14,8,4,0.62)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
                  <div className="font-display font-bold" style={{ fontSize: '18px', color }}>{value}</div>
                  <div style={{ fontSize: '10px', marginTop: '2px', color: 'rgba(255,255,255,0.5)' }}>{label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                 style={{ background: isDark ? 'rgba(14,8,4,0.78)' : 'rgba(14,8,4,0.62)', border: '1px solid rgba(255,255,255,0.11)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                   style={{ background: 'linear-gradient(135deg, #d4728f, #e8a4b8)', boxShadow: '0 4px 14px rgba(212,114,143,0.45)' }}>
                KN
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                </div>
                <p className="text-white/75 italic leading-snug truncate" style={{ fontSize: '11px' }}>"Saves me 12+ hours every week. Best studio tool!"</p>
                <p style={{ fontSize: '10px', marginTop: '2px', color: 'rgba(255,255,255,0.4)' }}>Kavya Nair · Bridal Artist, Bangalore</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          RIGHT — Auth Panel (theme-aware)
      ══════════════════════════════════════════════════ */}
      <div
        ref={rightPanelRef}
        onMouseMove={handleMouseMove}
        className="flex-1 flex flex-col overflow-hidden relative"
        style={{
          background: T.panelBg,
          color: T.heading,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(28px)',
          transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s',
        }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-200"
          style={{ background: T.toggleBg, color: T.toggleColor }}
          onMouseEnter={e => e.currentTarget.style.background = T.toggleHover}
          onMouseLeave={e => e.currentTarget.style.background = T.toggleBg}
        >
          {isDark
            ? <Sun size={15} style={{ color: '#f59e0b' }} />
            : <Moon size={15} style={{ color: '#c9956c' }} />}
        </button>

        {/* Mouse spotlight */}
        <div className="pointer-events-none absolute inset-0 z-0"
             style={{ background: `radial-gradient(480px circle at ${mousePos.x}px ${mousePos.y}px, rgba(190,100,45,0.11), transparent 72%)` }} />

        {/* Seam glow */}
        <div className="absolute top-0 -left-6 w-80 h-full pointer-events-none"
             style={{ background: 'linear-gradient(to right, rgba(160,80,30,0.22) 0%, rgba(190,110,50,0.1) 35%, transparent 70%)', filter: 'blur(32px)' }} />

        {/* Ambient orbs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(190,110,50,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute top-1/3 -left-16 w-72 h-72 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(201,149,108,0.16) 0%, transparent 70%)', filter: 'blur(55px)' }} />
        <div className="absolute -bottom-20 right-8 w-56 h-56 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(180,90,40,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        {/* Mobile header */}
        <div className="lg:hidden relative z-10 flex items-center justify-between px-5 py-4"
             style={{ borderBottom: `1px solid ${T.mobileHdrBorder}` }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #c9956c, #e8a4b8)' }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg" style={{ color: T.heading }}>MakeupDesk</span>
          </div>
          <Link to="/" className="text-xs no-underline flex items-center gap-1" style={{ color: T.dim }}>
            <ArrowLeft size={13} />Back
          </Link>
        </div>

        {/* Auth content */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-5 py-6 min-h-0">
          <div className="w-full max-w-[470px]">

            {/* Welcome heading */}
            <div className="hidden lg:block text-center mb-4"
                 style={{
                   opacity: mounted ? 1 : 0,
                   transform: mounted ? 'translateY(0)' : 'translateY(14px)',
                   transition: 'opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s',
                 }}>
              <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2"
                   style={{ background: 'linear-gradient(135deg, #c9956c, #e8a4b8)', boxShadow: '0 8px 36px rgba(201,149,108,0.5)' }}>
                <Sparkles size={24} className="text-white" />
                <div className="absolute inset-0 rounded-2xl animate-pulse-ring"
                     style={{ border: '2px solid rgba(201,149,108,0.45)' }} />
              </div>
              <h2 className="font-display text-2xl font-bold" style={{ color: T.heading }}>Welcome back</h2>
              <p className="text-xs mt-1" style={{ color: T.sub }}>Sign in to your MakeupDesk studio</p>
              <div className="flex items-center justify-center gap-1.5 mt-2.5">
                <div className="flex -space-x-1">
                  {['#c9956c','#d4728f','#e8a4b8'].map((c,i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[7px] font-bold text-white"
                         style={{ background: `linear-gradient(135deg, ${c}, ${c}cc)`, borderColor: T.avatarBorder, zIndex: 3-i }}>
                      {['P','K','A'][i]}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: '10px', color: T.dim }}>Trusted by <strong style={{ color: T.muted }}>500+</strong> studios across India</span>
              </div>
            </div>

            {/* Auth card */}
            <div className="relative p-[1.5px] rounded-[26px] overflow-hidden"
                 style={{
                   boxShadow: T.cardShadow,
                   opacity: mounted ? 1 : 0,
                   transform: mounted ? 'translateY(0) scale(1)' : 'translateY(22px) scale(0.97)',
                   transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.28s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.28s',
                 }}>
              <div className="absolute -inset-[150%] animate-border-beam"
                   style={{ background: 'conic-gradient(from 90deg at 50% 50%, #c9956c 0%, #e8a4b8 25%, transparent 50%, #c9956c 75%, #d4728f 100%)', opacity: 0.75 }} />

              <div className="relative rounded-[25px] overflow-hidden p-6 sm:p-7"
                   style={{ background: T.cardBg, backdropFilter: 'blur(24px)' }}>

                <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,149,108,0.62), transparent)' }} />

                {/* Tabs */}
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl mb-4"
                     style={{ background: T.tabBg, border: T.tabBorder }}>
                  {[
                    { id: 'signin',   label: 'Sign In' },
                    { id: 'register', label: 'Register' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => { setAuthMode(tab.id); setErrorMessage('') }}
                      className="py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-250 cursor-pointer border-none"
                      style={authMode === tab.id
                        ? { background: 'linear-gradient(135deg, #c9956c, #d4728f)', color: 'white', boxShadow: '0 4px 16px rgba(201,149,108,0.38)' }
                        : { background: 'transparent', color: T.faint }
                      }
                      onMouseEnter={e => { if (authMode !== tab.id) e.currentTarget.style.color = T.heading }}
                      onMouseLeave={e => { if (authMode !== tab.id) e.currentTarget.style.color = T.faint }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Demo fill */}
                {authMode === 'signin' && (
                  <button type="button" onClick={fillDemoCredentials}
                          className="w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold mb-4 cursor-pointer transition-all border-none"
                          style={{ background: 'rgba(201,149,108,0.1)', border: '1px solid rgba(201,149,108,0.28)', color: '#e8c4a0' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,149,108,0.2)'; e.currentTarget.style.borderColor = 'rgba(201,149,108,0.48)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,149,108,0.1)'; e.currentTarget.style.borderColor = 'rgba(201,149,108,0.28)' }}>
                    <Zap size={13} style={{ color: '#c9956c' }} />Fill Demo Credentials
                  </button>
                )}

                {/* Google */}
                <>
                  <button type="button" onClick={handleGoogleSignIn} disabled={isGoogleLoading}
                          className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold transition-all cursor-pointer border-none"
                          style={{ background: 'white', color: '#1f2937', boxShadow: '0 2px 10px rgba(0,0,0,0.22)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f8f9fa'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.28)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.22)' }}>
                    {isGoogleLoading ? (
                      <><RefreshCw size={17} className="animate-spin text-slate-500" /><span>Connecting…</span></>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>
                  <div className="relative my-4 flex items-center">
                    <div className="flex-1" style={{ borderTop: T.divider }} />
                    <span className="px-3 text-[11px] uppercase tracking-widest font-medium" style={{ color: T.dim }}>or</span>
                    <div className="flex-1" style={{ borderTop: T.divider }} />
                  </div>
                </>

                {/* Error */}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl flex items-center gap-2 text-xs font-medium animate-slide-in-up"
                       style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', color: '#fca5a5' }}>
                    <AlertCircle size={15} className="shrink-0" /><span>{errorMessage}</span>
                  </div>
                )}

                {/* ── SIGN IN ── */}
                {authMode === 'signin' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.label }}>Email</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.iconMuted }} />
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                               placeholder="artist@makeupdesk.in" className={`${inputCls} pl-10 pr-4 py-3`} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: T.label }}>Password</label>
                        <button type="button" onClick={() => { setIsForgotOpen(true); setForgotStep(1); setForgotEmail(email); setForgotError('') }}
                                className="text-xs font-medium cursor-pointer border-none bg-transparent transition-colors"
                                style={{ color: '#c9956c' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#e8c4a0'}
                                onMouseLeave={e => e.currentTarget.style.color = '#c9956c'}>
                          Forgot?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.iconMuted }} />
                        <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                               placeholder="••••••••••••" className={`${inputCls} pl-10 pr-11 py-3`} style={inputStyle} />
                        <button type="button" onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent transition-colors"
                                style={{ color: T.iconMuted }}
                                onMouseEnter={e => e.currentTarget.style.color = T.muted}
                                onMouseLeave={e => e.currentTarget.style.color = T.iconMuted}>
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                             className="w-4 h-4 rounded cursor-pointer accent-[#c9956c]" />
                      <span className="text-xs" style={{ color: T.muted }}>Remember me for 30 days</span>
                    </label>
                    <button type="submit" disabled={isSubmitting}
                            className="cta-shimmer w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer border-none transition-all duration-300 disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg, #c9956c, #d4728f)', boxShadow: '0 8px 28px rgba(201,149,108,0.38)' }}
                            onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.boxShadow = '0 16px 42px rgba(201,149,108,0.62)' }}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(201,149,108,0.38)'}>
                      {isSubmitting
                        ? <><RefreshCw size={16} className="animate-spin" /><span>Signing In…</span></>
                        : <><span>Sign In to Studio</span><ArrowRight size={16} /></>}
                    </button>
                  </form>
                )}

                {/* ── REGISTER ── */}
                {authMode === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: T.label }}>Studio Name</label>
                      <div className="relative">
                        <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.iconMuted }} />
                        <input type="text" required value={regStudioName} onChange={e => setRegStudioName(e.target.value)}
                               placeholder="Glow & Glam Studio" className={`${inputCls} pl-9 pr-3 py-2.5 text-xs`} style={inputStyle} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: T.label }}>Your Name</label>
                        <div className="relative">
                          <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.iconMuted }} />
                          <input type="text" required value={regFullName} onChange={e => setRegFullName(e.target.value)}
                                 placeholder="Priya Sharma" className={`${inputCls} pl-8 pr-2 py-2.5 text-xs`} style={inputStyle} />
                        </div>
                      </div>
                      <CustomSelect
                        label="Specialty"
                        value={regSpecialty}
                        options={[
                          { value: 'Bridal & Glam', label: 'Bridal & Glam' },
                          { value: 'Editorial & Fashion', label: 'Editorial & Fashion' },
                          { value: 'Celebrity & Event', label: 'Celebrity & Event' },
                        ]}
                        onChange={val => setRegSpecialty(val)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: T.label }}>Work Email</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.iconMuted }} />
                        <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)}
                               placeholder="priya@glamstudio.in" className={`${inputCls} pl-9 pr-3 py-2.5 text-xs`} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: T.label }}>Password</label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.iconMuted }} />
                        <input type="password" required value={regPassword} onChange={e => setRegPassword(e.target.value)}
                               placeholder="Min. 8 characters" className={`${inputCls} pl-9 pr-3 py-2.5 text-xs`} style={inputStyle} />
                      </div>
                    </div>
                    <button type="submit" disabled={isSubmitting}
                            className="w-full mt-1 py-3 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 cursor-pointer border-none transition-all duration-300"
                            style={{ background: 'linear-gradient(135deg, #c9956c, #d4728f)', boxShadow: '0 8px 28px rgba(201,149,108,0.38)' }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 14px 38px rgba(201,149,108,0.58)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(201,149,108,0.38)'}>
                      {isSubmitting
                        ? <><RefreshCw size={15} className="animate-spin" /><span>Creating…</span></>
                        : <><span>Create Studio Account</span><ArrowRight size={15} /></>}
                    </button>
                  </form>
                )}

                {/* Card footer */}
                <div className="mt-3 pt-3 flex items-center justify-center gap-1.5 text-xs"
                     style={{ borderTop: T.cardFooter, color: T.dim }}>
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span>256-bit Enterprise Encryption</span>
                </div>
              </div>
            </div>

            <p className="text-center text-xs mt-2" style={{ color: T.vfaint }}>
              © {new Date().getFullYear()} MakeupDesk · All rights reserved
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          Toast
      ══════════════════════════════════════════════════ */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-scale-in max-w-sm">
          <div className={`flex items-start gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
            toastMessage.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/30 text-rose-200'
              : 'bg-[#0e1a14]/95 border-emerald-500/30 text-emerald-100'
          }`}>
            {toastMessage.type === 'error'
              ? <AlertCircle size={17} className="text-rose-400 shrink-0 mt-0.5" />
              : <CheckCircle2 size={17} className="text-emerald-400 shrink-0 mt-0.5" />}
            <p className="text-xs font-medium leading-relaxed">{toastMessage.text}</p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          Forgot Password Modal (theme-aware)
      ══════════════════════════════════════════════════ */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in"
             style={{ background: T.modalOverlay, backdropFilter: 'blur(18px)' }}>
          <div className="w-full max-w-md rounded-3xl p-7 sm:p-8 relative overflow-hidden"
               style={{ background: T.modalBg, border: T.modalBorder, boxShadow: '0 40px 100px rgba(0,0,0,0.45)', color: T.heading }}>

            <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,149,108,0.55), transparent)' }} />

            <button onClick={closeForgotModal}
                    className="absolute top-4 right-4 p-2 rounded-full cursor-pointer border-none transition-all"
                    style={{ background: T.toggleBg, color: T.muted }}
                    onMouseEnter={e => e.currentTarget.style.background = T.toggleHover}
                    onMouseLeave={e => e.currentTarget.style.background = T.toggleBg}>
              <X size={16} />
            </button>

            {/* Step 1 */}
            {forgotStep === 1 && (
              <div className="space-y-5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(201,149,108,0.15)', border: '1px solid rgba(201,149,108,0.3)' }}>
                  <KeyRound size={20} style={{ color: '#c9956c' }} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display" style={{ color: T.heading }}>Reset Password</h3>
                  <p className="text-sm mt-1" style={{ color: T.muted }}>Enter your account email to receive a code.</p>
                </div>
                {forgotError && <div className="p-3 rounded-xl flex items-center gap-2 text-xs" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', color: '#fca5a5' }}><AlertCircle size={14} /><span>{forgotError}</span></div>}
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.label }}>Email</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.iconMuted }} />
                      <input type="email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="artist@makeupdesk.in" className={`${inputCls} pl-10 pr-4 py-3`} style={inputStyle} />
                    </div>
                  </div>
                  <button type="submit" disabled={forgotLoading} className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer border-none" style={{ background: 'linear-gradient(135deg, #c9956c, #d4728f)', boxShadow: '0 8px 24px rgba(201,149,108,0.32)' }}>
                    {forgotLoading ? <><RefreshCw size={16} className="animate-spin" /><span>Sending…</span></> : <><span>Send Code</span><ArrowRight size={16} /></>}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2 */}
            {forgotStep === 2 && (
              <div className="space-y-5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(232,164,184,0.15)', border: '1px solid rgba(232,164,184,0.3)' }}>
                  <ShieldCheck size={20} style={{ color: '#e8a4b8' }} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display" style={{ color: T.heading }}>Enter 4-Digit Code</h3>
                  <p className="text-sm mt-1" style={{ color: T.muted }}>Sent to <span style={{ color: T.heading, fontWeight: 500 }}>{forgotEmail}</span></p>
                </div>
                <button type="button" onClick={fillDemoOtp} className="w-full py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs cursor-pointer border-none" style={{ background: T.tabBg, border: T.tabBorder, color: '#e8c4a0' }}>
                  <Zap size={12} style={{ color: '#c9956c' }} />Auto-fill: 4 8 2 9
                </button>
                {forgotError && <div className="p-3 rounded-xl flex items-center gap-2 text-xs" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', color: '#fca5a5' }}><AlertCircle size={14} /><span>{forgotError}</span></div>}
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, idx) => (
                      <input key={idx} ref={otpInputRefs[idx]} type="text" maxLength={1} value={digit}
                             onChange={e => handleOtpChange(idx, e.target.value)}
                             onKeyDown={e => handleOtpKeyDown(idx, e)}
                             className="w-14 h-14 text-center text-2xl font-bold rounded-2xl transition-all focus:outline-none"
                             style={{ background: T.otpBg, border: `1.5px solid ${T.otpBorder}`, color: T.heading }}
                             onFocus={e => { e.target.style.borderColor = '#c9956c'; e.target.style.boxShadow = '0 0 0 3px rgba(201,149,108,0.22)' }}
                             onBlur={e => { e.target.style.borderColor = T.otpBorder; e.target.style.boxShadow = 'none' }} />
                    ))}
                  </div>
                  <div className="text-center text-xs" style={{ color: T.muted }}>
                    {resendTimer > 0
                      ? <span>Resend in <strong style={{ color: T.heading }}>{resendTimer}s</strong></span>
                      : <button type="button" onClick={() => { setResendTimer(45); showToast('Code resent!') }} className="cursor-pointer font-medium border-none bg-transparent" style={{ color: '#c9956c' }}>Resend Code</button>}
                  </div>
                  <button type="submit" disabled={forgotLoading} className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer border-none" style={{ background: 'linear-gradient(135deg, #c9956c, #d4728f)', boxShadow: '0 8px 24px rgba(201,149,108,0.32)' }}>
                    {forgotLoading ? <><RefreshCw size={16} className="animate-spin" /><span>Verifying…</span></> : <><span>Verify &amp; Continue</span><ArrowRight size={16} /></>}
                  </button>
                </form>
              </div>
            )}

            {/* Step 3 */}
            {forgotStep === 3 && (
              <div className="space-y-5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
                  <Lock size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display" style={{ color: T.heading }}>New Password</h3>
                  <p className="text-sm mt-1" style={{ color: T.muted }}>Create a strong new password.</p>
                </div>
                {forgotError && <div className="p-3 rounded-xl flex items-center gap-2 text-xs" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', color: '#fca5a5' }}><AlertCircle size={14} /><span>{forgotError}</span></div>}
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.label }}>New Password</label>
                    <div className="relative">
                      <input type={showNewPassword ? 'text' : 'password'} required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••••••" className={`${inputCls} px-4 py-3 pr-11`} style={inputStyle} />
                      <button type="button" onClick={() => setShowNewPassword(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent" style={{ color: T.iconMuted }}>
                        {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  {newPassword.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: T.muted }}>Strength:</span>
                        <span style={{ fontWeight: 600, color: strengthScore <= 1 ? '#f87171' : strengthScore <= 3 ? '#fbbf24' : '#34d399' }}>
                          {strengthScore <= 1 ? 'Weak' : strengthScore <= 3 ? 'Medium' : 'Strong'}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full flex gap-1">
                        {[1,2,3,4].map(n => (
                          <div key={n} className="flex-1 h-full rounded-full transition-all"
                               style={{ background: strengthScore >= n ? (n <= 1 ? '#f87171' : n <= 3 ? '#fbbf24' : '#34d399') : T.strengthEmpty }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: T.label }}>Confirm</label>
                    <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••••••" className={`${inputCls} px-4 py-3`} style={inputStyle} />
                  </div>
                  <button type="submit" disabled={forgotLoading} className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer border-none" style={{ background: 'linear-gradient(135deg, #c9956c, #d4728f)', boxShadow: '0 8px 24px rgba(201,149,108,0.32)' }}>
                    {forgotLoading ? <><RefreshCw size={16} className="animate-spin" /><span>Updating…</span></> : <><span>Reset Password</span><ArrowRight size={16} /></>}
                  </button>
                </form>
              </div>
            )}

            {/* Step 4 */}
            {forgotStep === 4 && (
              <div className="text-center space-y-5 py-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.35)', boxShadow: '0 0 40px rgba(52,211,153,0.2)' }}>
                  <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} className="animate-checkmark" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display" style={{ color: T.heading }}>Password Reset!</h3>
                  <p className="text-sm mt-2 max-w-xs mx-auto leading-relaxed" style={{ color: T.muted }}>Your new credentials have been pre-filled in the sign-in form.</p>
                </div>
                <button type="button" onClick={closeForgotModal} className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer border-none" style={{ background: 'linear-gradient(135deg, #c9956c, #d4728f)', boxShadow: '0 8px 24px rgba(201,149,108,0.32)' }}>
                  <span>Sign In Now</span><ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
