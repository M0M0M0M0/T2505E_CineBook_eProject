export function Button({ children, onClick, variant = "default", className = "" }) {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none";

  const variants = {
    default: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </button>
  );
}
