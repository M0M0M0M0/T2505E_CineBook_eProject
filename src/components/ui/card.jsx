// src/components/ui/card.jsx
export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl shadow-md bg-white p-4 border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`border-b pb-2 mb-3 font-semibold text-lg ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
