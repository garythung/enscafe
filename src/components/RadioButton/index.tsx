const BASE_CLASSNAMES = [
  "rounded-full",
  "py-0.5",
  "px-3",
  "flex",
  "justify-center",
  "items-center",
  "tracking-tight",
  "text-sm",
  "font-medium",
];

interface Props {
  variant?:
    | "gradient"
    | "primary"
    | "secondary"
    | "radio-checked"
    | "radio-unchecked";
  fluid?: boolean;
  onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  checked: boolean;
}

export default function RadioButton({
  variant = "gradient",
  fluid = false,
  onClick,
  children,
  loading = false,
  disabled = false,
  checked = false,
  type = "button",
  ...props
}: Props) {
  const classNames: string[] = [].concat(BASE_CLASSNAMES);
  if (fluid) {
    classNames.push("w-full");
  }

  if (disabled || loading) {
    classNames.push("opacity-30");
    classNames.push("cursor-not-allowed");
  }

  if (checked) {
    classNames.push("text-white bg-black");
  } else {
    classNames.push("bg-white border border-black text-black");
  }

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classNames.join(" ")}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}
