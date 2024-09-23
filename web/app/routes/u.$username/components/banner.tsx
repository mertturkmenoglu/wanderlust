type Props = {
  children: React.ReactNode;
};

export default function Banner({ children }: Props) {
  return (
    <div className="mx-auto">
      <img
        src="https://i.imgur.com/EwvUEmR.jpg"
        alt="banner"
        className="h-48 w-full object-cover object-top rounded-lg"
      />

      <div>{children}</div>
    </div>
  );
}
