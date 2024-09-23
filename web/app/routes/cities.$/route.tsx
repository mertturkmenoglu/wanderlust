import { LoaderFunctionArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params;
  console.log(slug);
  return null;
};

export default function Page() {
  const params = useParams();
  const slug = params["*"];

  if (!slug || slug.length < 1) {
    return <div>This is the cities page</div>;
  }

  const p = slug.split("/")[0];

  return (
    <div>
      <div>This is the cities page</div>
      <div>{JSON.stringify(p)}</div>
    </div>
  );
}
