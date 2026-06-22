export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-primary-container/10 text-primary-container",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full font-label-eyebrow text-label-eyebrow uppercase tracking-widest ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
