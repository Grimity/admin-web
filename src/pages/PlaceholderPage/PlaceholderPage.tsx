interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div
      style={{
        padding: '48px 16px',
        textAlign: 'center',
        color: '#6b7280',
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
      }}
    >
      <h1 style={{ marginTop: 0, fontSize: 20, color: '#111827' }}>{title}</h1>
      <p style={{ margin: 0 }}>준비 중입니다.</p>
    </div>
  );
}
