import { parse } from 'csv-parse';
import fs from 'node:fs';
import { cities, countries, db, states } from '../src/db';
import { logger } from '../src/logger';

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

const citiesPathname = 'cities.csv';
const statesPathname = 'states.csv';
const countriesPathname = 'countries.csv';

async function checkFilesExist() {
  const files = [citiesPathname, statesPathname, countriesPathname].map(
    (file) => {
      return [import.meta.dir, 'data', file].join('/');
    }
  );

  for (const file of files) {
    const ok = await Bun.file(file).exists();

    if (!ok) {
      logger.error(`File ${file} not found`);
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
      logger.error(err.message);
      reject(err);
    });

    parser.on('end', function () {
      logger.info(`${path} processed successfully!`);
      resolve(items);
    });

    const fullPath = [import.meta.dir, 'data', path].join('/');

    fs.createReadStream(fullPath).pipe(parser);
  });
}

export async function syncLocations() {
  logger.info('Syncing locations...');

  const ok = await checkFilesExist();

  if (!ok) {
    process.exit(1);
  }

  const [countriesData, statesData, citiesData] = await Promise.all([
    readCsv<Country>(countriesPathname),
    readCsv<State>(statesPathname),
    readCsv<City>(citiesPathname),
  ]);

  let i = 1;

  for (const country of countriesData) {
    logger.info(`Processing country ${i}/${countriesData.length}`);
    try {
      await db.insert(countries).values({
        id: country.id,
        name: country.name,
        iso2: country.iso2,
        numericCode: country.numeric_code,
        phoneCode: country.phone_code,
        capital: country.capital,
        currency: country.currency,
        currencyName: country.currency_name,
        currencySymbol: country.currency_symbol,
        tld: country.tld,
        native: country.native,
        region: country.region,
        subregion: country.subregion,
        timezones: country.timezones,
        latitude: country.latitude,
        longitude: country.longitude,
      });
      logger.info(`Country ${i} inserted successfully!`);
    } catch (error) {
      logger.error(`Error processing country ${i}`);
    }
    i++;
  }

  i = 1;

  for (const state of statesData) {
    logger.info(`Processing state ${i}/${statesData.length}`);
    try {
      await db.insert(states).values({
        id: state.id,
        name: state.name,
        countryId: state.country_id,
        countryCode: state.country_code,
        countryName: state.country_name,
        stateCode: state.state_code,
        type: state.type,
        latitude: state.latitude,
        longitude: state.longitude,
      });
      logger.info(`State ${i} inserted successfully!`);
    } catch (error) {
      logger.error(`Error processing state ${i}`);
    }
    i++;
  }

  i = 1;

  for (const city of citiesData) {
    logger.info(`Processing city ${i}/${citiesData.length}`);
    try {
      await db.insert(cities).values({
        id: city.id,
        name: city.name,
        stateId: city.state_id,
        stateCode: city.state_code,
        stateName: city.state_name,
        countryId: city.country_id,
        countryCode: city.country_code,
        countryName: city.country_name,
        latitude: city.latitude,
        longitude: city.longitude,
        wikiDataId: city.wikiDataId,
      });
      logger.info(`City ${i} inserted successfully!`);
    } catch (error) {
      logger.error(`Error processing city ${i}`);
    }
    i++;
  }

  logger.info('Script ended');
  process.exit(0);
}

syncLocations();
