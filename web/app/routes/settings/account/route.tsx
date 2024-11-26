import { redirect } from "react-router";
import FacebookIcon from "~/components/icons/facebook";
import GoogleIcon from "~/components/icons/google";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { getMe, getUserByUsername } from "~/lib/api";
import { getCookiesFromRequest } from "~/lib/cookies";
import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const auth = await getMe({
      headers: { Cookie: getCookiesFromRequest(request) },
    });

    if (!auth.data) {
      throw redirect("/");
    }

    const profile = await getUserByUsername(auth.data.username);

    return { auth: auth.data, profile: profile.data };
  } catch (e) {
    throw redirect("/");
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { auth } = loaderData;

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Account</h2>

      <div className="grid grid-cols-3 gap-4 mt-4 items-center">
        <Label htmlFor="email">Email</Label>
        <div className="col-span-2 flex">
          <Input id="name" disabled={true} value={auth.email} />
          <Button variant="link">Change</Button>
        </div>

        <Label htmlFor="username">Username</Label>
        <div className="col-span-2 flex">
          <Input id="username" disabled={true} value={auth.username} />
          <Button variant="link">Change</Button>
        </div>

        <Label htmlFor="password">Password</Label>
        <div className="col-span-2 flex">
          <Input id="password" disabled={true} value="********" />
          <Button variant="link">Change</Button>
        </div>

        <Separator className="my-4 col-span-full" />

        <Label>Social Logins</Label>
        <div className="col-span-2 flex gap-4">
          <Button variant="outline" disabled={auth.googleId === null}>
            <GoogleIcon className="size-4" />
          </Button>
          <Button variant="outline" disabled={auth.facebookId === null}>
            <FacebookIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
