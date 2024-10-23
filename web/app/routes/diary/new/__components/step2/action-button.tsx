type Props = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export default function ActionButton({
  children,
  onClick,
  disabled = false,
}: Props) {
  return (
    <button
      className="p-1.5 hover:bg-muted rounded-full disabled:hover:bg-transparent"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
