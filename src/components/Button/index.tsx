type Variant =
  | "gradient"
  | "gradient-secondary"
  | "primary"
  | "secondary"
  | "secondary-black"
  | "pill"
  | "pill-secondary"
  | "destructive"
  | "destructive-secondary"
  | "error";

interface Props {
  variant?: Variant;
  size?: "sm" | "md";
  fluid?: boolean;
  onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

type LoadingProps = {
  size: "sm" | "md";
  loading: boolean;
  variant: Variant;
};
const LoadingSpinner = ({
  size = "md",
  loading = false,
  variant,
}: LoadingProps) => {
  if (!loading) {
    return null;
  }

  let textColor = "text-white";
  if (variant === "secondary") {
    textColor = "text-gray-500";
  } else if (["pill-secondary", "secondary-black"].includes(variant)) {
    textColor = "text-black";
  }

  let sizing = "mr-3 h-5 w-5";
  if (size === "sm") {
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

const BASE_CLASSNAMES = [
  "rounded-full",
  "flex",
  "justify-center",
  "items-center",
  "tracking-tight",
  "text-md",
];

const Button = ({
  variant = "gradient",
  size = "md",
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
    classNames.push("text-black bg-gradient");
  } else if (variant === "gradient-secondary") {
    classNames.push("text-black bg-gradient-pink");
  } else if (variant === "primary") {
    classNames.push("text-white bg-gray-500");
    classNames.push(
      "transition ease-out duration-150 hover:font-medium hover:drop-shadow-lg",
    );
  } else if (variant === "secondary") {
    classNames.push("text-gray-700 border-1 border-gray-700");
  } else if (variant === "secondary-black") {
    classNames.push("text-black border-1 border-black");
  } else if (variant === "pill") {
    classNames.push("text-white bg-black");
  } else if (variant === "pill-secondary") {
    classNames.push("text-black bg-white border-1 border-black");
    classNames.push(
      "transition ease-out duration-150 hover:bg-black hover:text-white",
    );
  } else if (variant === "destructive") {
    classNames.push("text-white bg-cafe-pink");
  } else if (variant === "destructive-secondary") {
    classNames.push("text-cafe-pink bg-white border-1 border-cafe-pink");
    classNames.push(
      "transition ease-out duration-150 hover:bg-cafe-pink hover:text-white",
    );
  } else if (variant === "error") {
    classNames.push("text-white bg-red-500 font-bold");
  }

  if (size === "sm") {
    classNames.push("py-0.5 px-3 text-sm");
  } else if (size === "md") {
    classNames.push("py-3 px-6");
  }

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classNames.join(" ")}
    >
      <LoadingSpinner size={size} loading={loading} variant={variant} />
      {children}
    </button>
  );
};

export default Button;
