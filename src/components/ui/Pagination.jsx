import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const btnBase = {
    width: '32px', height: '32px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.15s', fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          style={{
            ...btnBase,
            border: '1.5px solid var(--dash-border)',
            background: 'var(--dash-surface)',
            color: page === 1 ? 'var(--dash-text-muted)' : 'var(--dash-text-primary)',
            opacity: page === 1 ? 0.45 : 1,
            cursor: page === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              ...btnBase,
              border: p === page ? '1.5px solid transparent' : '1.5px solid var(--dash-border)',
              background: p === page
                ? 'linear-gradient(135deg, #c9956c 0%, #d4728f 100%)'
                : 'var(--dash-surface)',
              color: p === page ? '#ffffff' : 'var(--dash-text-secondary)',
              fontWeight: p === page ? 700 : 500,
              boxShadow: p === page ? '0 2px 8px rgba(201,149,108,0.35)' : 'none',
            }}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          style={{
            ...btnBase,
            border: '1.5px solid var(--dash-border)',
            background: 'var(--dash-surface)',
            color: page === totalPages ? 'var(--dash-text-muted)' : 'var(--dash-text-primary)',
            opacity: page === totalPages ? 0.45 : 1,
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          <ChevronRight size={16} />
        </button>
    </div>
  )
}
