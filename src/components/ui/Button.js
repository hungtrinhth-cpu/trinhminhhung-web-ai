export default function Button({ children, variant = "primary", className = "", ...props }) {
  const baseClasses = "rounded-full font-button-text text-button-text transition-all duration-300 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-visun-orange text-white px-10 py-5 hover:bg-sunset hover:scale-105 shadow-lg shadow-visun-orange/25 active:scale-95 btn-shimmer relative overflow-hidden",
    secondary: "bg-transparent border-2 border-visun-blue text-visun-blue px-10 py-5 hover:bg-visun-blue hover:text-white",
    // w-11 h-11 = 44px — meets Apple HIG and Material Design minimum touch target
    icon: "w-11 h-11 border border-visun-blue/30 text-visun-blue hover:bg-visun-blue hover:border-visun-blue hover:text-white",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
