import { cliui } from '@poppinss/cliui';
import { parse } from 'csv-parse';
import fs from 'node:fs';

const ui = cliui();

type Country = {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  subregion: string;
  timezones: string;
  latitude: number;
  longitude: number;
  emoji: string;
  emojiU: string;
};

type State = {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  state_code: string;
  type: string | null;
  latitude: number;
  longitude: number;
};

type City = {
  id: number;
  name: string;
  state_id: number;
  state_code: string;
  state_name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  wikiDataId: string;
};

const citiesPathname = 'src/scripts/data/cities.csv';
const statesPathname = 'src/scripts/data/states.csv';
const countriesPathname = 'src/scripts/data/countries.csv';

function checkFilesExist() {
  const files = [citiesPathname, statesPathname, countriesPathname];

  for (const file of files) {
    if (!fs.existsSync(file)) {
      ui.logger.error(`File ${file} not found`);
      return false;
    }
  }

  return true;
}

function readCsv<T>(path: string) {
  return new Promise<T[]>((resolve, reject) => {
    const items: T[] = [];
    const parser = parse({
      columns: true,
      delimiter: ',',
    });

    parser.on('readable', function () {
      let record;
      while ((record = parser.read()) !== null) {
        items.push(record);
      }
    });

    parser.on('error', function (err) {
      ui.logger.error(err.message);
      reject(err);
    });

    parser.on('end', function () {
      ui.logger.success(`${path} processed successfully!`);
      resolve(items);
    });

    fs.createReadStream(path).pipe(parser);
  });
}

export async function syncLocations() {
  ui.logger.info('Syncing locations...');

  if (!checkFilesExist()) {
    process.exit(1);
  }

  const [_countries, _states, _cities] = await Promise.all([
    readCsv<Country>(countriesPathname),
    readCsv<State>(statesPathname),
    readCsv<City>(citiesPathname),
  ]);

  // TODO: Implement the logic to add the locations to the database
  // ui.logger.success("Locations synced successfully!");

  ui.logger.error('Not implemented yet!');
}

syncLocations();
