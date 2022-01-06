type Props = {
  color: "green" | "yellow";
  children: React.ReactNode;
};

export default function Badge({ color, children }: Props) {
  const backgroundColor =
    color === "green" ? "bg-badge-green" : "bg-badge-yellow";
  const textColor =
    color === "green" ? "text-badge-green-text" : "text-badge-yellow-text";
  return (
    <span
      className={`w-min capitalize text-sm font-bold rounded-3xl px-4 py-2 tracking-tight ${backgroundColor} ${textColor}`}
    >
      {children}
    </span>
  );
}
