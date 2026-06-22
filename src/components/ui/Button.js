export default function Button({ children, variant = "primary", className = "", ...props }) {
  const baseClasses = "rounded-full font-button-text text-button-text transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary-container text-white px-10 py-5 hover:scale-105 shadow-lg shadow-primary-container/20 active:scale-95",
    secondary: "bg-transparent border border-outline text-ink-text px-10 py-5 hover:bg-ink-text hover:text-pure-white",
    icon: "w-10 h-10 border border-outline hover:bg-primary-container hover:border-primary-container hover:text-white",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
