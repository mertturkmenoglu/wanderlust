import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function TabLocations() {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Edit Entry Locations</CardTitle>
        <CardDescription>
          You can edit your diary entry locations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="max-w-xl">
          Locations
        </form>
      </CardContent>
      <CardFooter>
        <Button>Update</Button>
      </CardFooter>
    </Card>
  );
}
