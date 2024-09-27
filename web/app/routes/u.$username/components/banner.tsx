type Props = {
  userBannerImage?: string;
  children: React.ReactNode;
};

export default function Banner({
  userBannerImage = "https://i.imgur.com/EwvUEmR.jpg",
  children,
}: Props) {
  return (
    <div className="mx-auto">
      <img
        src={userBannerImage}
        alt="banner"
        className="h-48 w-full object-cover object-top rounded-lg"
      />

      <div>{children}</div>
    </div>
  );
}
