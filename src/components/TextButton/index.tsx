const TextButton = ({ onClick, children, ...props }) => {
  return (
    <button
      {...props}
      className="border-0 bg-transparent font-semibold text-primary-blue"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default TextButton;
