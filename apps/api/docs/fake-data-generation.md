# Fake Data Generation

---

## Initial Setup

- You must first run the `addresses` script.
- `addresses` script requires CSV files inside `scripts/data` folder.
- Put `cities.csv`, `countries.csv`, and `states.csv` files inside `scripts/data` folder.
- Run `bun addresses` command to insert city, state, and country information to database.
- After that, you must run the `fake` script.
- `fake` script generates fake data.
- Script will ask you what type of data you want to generate.
- First choose `categories` since other fake data may depend on available category information.
- Then, choose `locations` and generate fake location information.
- Generated fake data will be inside `scripts/data` folder named as `<data_type>.json`.
- Now you must insert the fake data into the database.
- Use `seed` script.
- Your API server must be running in the background because it fill use the API endpoints to first validate the DTO, and then insert it into the database.
- You **must** insert categories first.
- Then you can insert other type of data.
- Make sure you have the `TEST_JWT` environment variable. It will bypass the rate limiter to send requests at maximum capacity.
- Make sure you have the `ADMIN_ID` environment variable.
