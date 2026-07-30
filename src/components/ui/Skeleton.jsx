export function Skeleton({ width, height = '20px', borderRadius = '8px', style: extra }) {
  return (
    <div
      style={{
        width: width || '100%',
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--dash-subtle-row-bg) 25%, var(--dash-border) 50%, var(--dash-subtle-row-bg) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-pulse 1.6s ease-in-out infinite',
        ...extra,
      }}
    />
  )
}

export function SkeletonCard({ count = 3 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '18px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: 'var(--dash-card-bg)',
            borderRadius: '16px',
            border: '1.5px solid var(--dash-border)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Skeleton width="60%" height="22px" />
          <Skeleton width="90%" height="14px" />
          <Skeleton width="40%" height="14px" />
          <div style={{ paddingTop: '12px', borderTop: '1px dashed var(--dash-border)', display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton width="30%" height="16px" />
            <Skeleton width="25%" height="24px" borderRadius="6px" />
          </div>
        </div>
      ))}
    </div>
  )
}
