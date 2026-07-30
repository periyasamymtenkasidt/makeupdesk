import { Sparkles } from 'lucide-react'
import { Card } from './Card'
import { Button } from './Button'

export function EmptyState({
  icon: Icon = Sparkles,
  title = 'No Items Found',
  subtitle = 'Try adjusting your search filters or add a new record.',
  actionLabel,
  onAction,
  style: extra,
}) {
  return (
    <Card
      style={{
        textAlign: 'center',
        padding: '56px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justify: 'center',
        gap: '12px',
        background: 'var(--dash-card-bg)',
        border: '1.5px dashed var(--dash-border)',
        borderRadius: '20px',
        ...extra,
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(201,149,108,0.12) 0%, rgba(212,114,143,0.12) 100%)',
          border: '1px solid rgba(201,149,108,0.25)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          marginBottom: '4px',
          boxShadow: '0 4px 16px rgba(201,149,108,0.12)',
        }}
      >
        <Icon size={24} style={{ color: 'var(--icon-booking)' }} />
      </div>

      <h3
        style={{
          margin: 0,
          fontFamily: 'Playfair Display, serif',
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--dash-text-primary)',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          fontSize: '13px',
          color: 'var(--dash-text-muted)',
          maxWidth: '340px',
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </p>

      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAction}
          style={{ marginTop: '8px' }}
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  )
}
