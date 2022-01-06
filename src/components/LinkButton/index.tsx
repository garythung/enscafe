import Link from "next/link";

const BASE_CLASSNAMES = [
  "bg-primary-blue",
  "text-white",
  "rounded-lg",
  "p-3",
  "text-sm",
  "font-semibold",
  "text-center",
];

const LinkButton = ({ fluid = false, children, href, ...props }) => {
  let classNames: string[] = [].concat(BASE_CLASSNAMES);
  if (fluid) {
    classNames.push("w-full");
  }

  return (
    <Link href={href} passHref>
      <a {...props} className={classNames.join(" ")}>
        {children}
      </a>
    </Link>
  );
};

export default LinkButton;
