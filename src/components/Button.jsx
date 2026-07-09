const VARIANTS = {
  primary:
    "bg-teal-700 text-teal-50 hover:bg-teal-800 active:bg-teal-900 shadow-sm shadow-teal-900/20",
  outline:
    "bg-white text-teal-800 border border-teal-200 hover:bg-teal-50 active:bg-teal-100",
  ghost: "bg-transparent text-teal-700 hover:bg-teal-50 active:bg-teal-100",
  pastel: "bg-lilac text-teal-900 hover:brightness-95 active:brightness-90",
};

export default function Button({
  variant = "primary",
  className = "",
  disabled,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`font-ui inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] font-semibold tracking-tight transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
