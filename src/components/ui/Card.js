export default function Card({ children, className = "", hover = true }) {
  return (
    <div
      className={`glass-card p-8 rounded-xl flex flex-col group ${
        hover ? "hover:border-primary-container/50" : ""
      } transition-all duration-500 ${className}`}
    >
      {children}
    </div>
  );
}
