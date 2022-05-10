const BASE_CLASSNAMES = [
  "rounded-full",
  "flex",
  "justify-center",
  "items-center",
  "tracking-tight",
];

interface Props {
  variant?:
    | "gradient"
    | "primary"
    | "secondary"
    | "pill"
    | "pill-secondary"
    | "error";
  fluid?: boolean;
  onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const LoadingSpinner = ({ loading = false, variant }) => {
  if (!loading) {
    return null;
  }

  let textColor = "text-white";
  if (variant === "secondary") {
    textColor = "text-cafe-pink";
  } else if (variant === "pill-secondary") {
    textColor = "text-black";
  }

  let sizing = "mr-3 h-5 w-5";
  if (["pill", "pill-secondary"].includes(variant)) {
    sizing = "mr-1 h-3.5 w-3.5";
  }

  return (
    <svg
      className={`animate-spin -ml-1 ${sizing} ${textColor}`}
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
  );
};

const Button = ({
  variant = "gradient",
  fluid = false,
  onClick,
  children,
  loading = false,
  disabled = false,
  type = "button",
  ...props
}: Props) => {
  const classNames: string[] = [].concat(BASE_CLASSNAMES);
  if (fluid) {
    classNames.push("w-full");
  }

  if (disabled || loading) {
    classNames.push("opacity-30");
    classNames.push("cursor-not-allowed");
  }

  if (variant === "gradient") {
    classNames.push("text-white bg-gradient");
  } else if (variant === "primary") {
    classNames.push("text-white bg-cafe-pink");
  } else if (variant === "secondary") {
    classNames.push("text-cafe-pink border-1 border-cafe-pink");
  } else if (variant === "pill") {
    classNames.push("text-white bg-black");
  } else if (variant === "pill-secondary") {
    classNames.push("text-black bg-white border-1 border-black");
  } else if (variant === "error") {
    classNames.push("text-white bg-red-500 font-bold");
  }

  if (["pill", "pill-secondary"].includes(variant)) {
    classNames.push("py-0.5 px-3 text-sm");
  } else {
    classNames.push("py-3 px-6 font-medium");
  }

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classNames.join(" ")}
    >
      <LoadingSpinner loading={loading} variant={variant} />
      {children}
    </button>
  );
};

export default Button;
