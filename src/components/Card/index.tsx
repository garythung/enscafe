type Props = {
  children: React.ReactNode;
  color?: "yellow" | "pink";
};

export default function Card({ children, color }: Props) {
  let boxShadow = "-4px 4px 0px 0px";
  if (color === "yellow") {
    boxShadow += " #FFDD6E";
  } else if (color === "pink") {
    boxShadow += " #FF706E";
  } else {
    boxShadow += " #000000";
  }

  return (
    <div
      className="px-4 py-2 rounded-lg w-full h-full"
      style={{
        boxShadow,
        border: "2px solid black",
      }}
    >
      {children}
    </div>
  );
}
