type Props = {
  text: string;
  spin?: "x" | "y";
};

export default function WordArt({ text, spin }: Props) {
  return (
    <div
      className={`flex items-center justify-center w-full h-full px-8 py-5 inline-block border-1 border-black ${
        spin === "x" ? "animate-spin-slow-x" : ""
      } ${spin === "y" ? "animate-spin-slow-y" : ""}`}
    >
      <span className="text-3xl font-bold font-pressura">{text}</span>
    </div>
  );
}
