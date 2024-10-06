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
        className="h-64 w-full object-cover object-center rounded-lg"
      />

      <div>{children}</div>
    </div>
  );
}
