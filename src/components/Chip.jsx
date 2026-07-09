const TINTS = {
  flowers: "bg-blush text-teal-900",
  ocean: "bg-sky text-teal-900",
  nature: "bg-teal-100 text-teal-900",
  sky: "bg-sky text-teal-900",
  abstract: "bg-lilac text-teal-900",
  surprise: "bg-butter text-teal-900",
};

export default function Chip({ active, tint = "nature", disabled, children, ...props }) {
  return (
    <button
      disabled={disabled}
      className={`font-ui shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
        TINTS[tint] ?? TINTS.nature
      } ${
        active
          ? "ring-2 ring-teal-700 ring-offset-2 ring-offset-paper"
          : "opacity-70 hover:opacity-100"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
