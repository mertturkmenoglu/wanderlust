import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import crypto from 'node:crypto';

type Props = {
  params: {
    slug: string[];
  };
};

async function getCity(id: string) {
  const res = await fetch(`http://localhost:5000/api/cities/${id}`);
  return res.json();
}

async function getWikiData(wikiDataId: string) {
  console.log(wikiDataId);
  const res = await fetch(
    `https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=${wikiDataId}&formatversion=2`
  );
  return res.json();
}

export default async function Page({ params: { slug } }: Readonly<Props>) {
  if (!slug || slug.length < 1) {
    throw new Error('404: Invalid city id');
  }
  const cityId = slug[0];
  const city = await getCity(cityId);
  const wikiData = await getWikiData(city.data.wikiDataId);
  const imageData = wikiData.claims.P18;
  const imageName: string = imageData[0].mainsnak.datavalue.value;
  const imageNameHash = crypto.hash('md5', imageName.replace(/ /g, '_'));
  // const imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${imageNameHash[0]}/${imageNameHash.slice(0, 2)}/${imageName.replace(/ /g, '_')}`;
  const imageUrl =
    'https://storage.needpix.com/rsynced_images/vienna-933500_1280.jpg';

  return (
    <div className="mx-auto max-w-3xl py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Discover</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/cities">Cities</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Vienna</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <img
        src={imageUrl}
        alt=""
        className="mt-8 aspect-video rounded-md object-cover"
      />
      <h2 className="mt-8 text-6xl font-bold">{city.data.name}</h2>
      <div className="mt-2 text-sm text-muted-foreground">
        {city.data.state.name}/{city.data.country.name}
      </div>

      <div className="mt-4 text-lg text-muted-foreground">
        Vienna is the capital, most populous city, and one of nine federal
        states of Austria. It is Austria&apos;s primate city, with just over two
        million inhabitants. Its larger metropolitan area has a population of
        nearly 2.9 million, representing nearly one-third of the country&apos;s
        population. Vienna is the cultural, economic, and political center of
        the country, the fifth-largest city by population in the European Union,
        and the most-populous of the cities on the Danube river.
      </div>

      <div className="mt-8 flex max-w-lg items-start gap-4">
        <div className="text-sm text-muted-foreground">
          <div className="">
            Currency: {city.data.country.currencyName} (
            {city.data.country.currencySymbol})
          </div>
          <div>Native: {city.data.country.native}</div>
          <div>Region: {city.data.country.region}</div>
          <div>Internet Domain: {city.data.country.tld}</div>
        </div>
      </div>
    </div>
  );
}
