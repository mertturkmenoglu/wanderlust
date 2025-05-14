# Fake Data Generation (Out of Date Documentation)

## Prerequisites

- Make sure your database is up and running.

## Running

- Run `just fake` command.
- Follow the on screen instructions to generate fake data.
- First you must select the type of fake data you want to generate.
- Example types:
  - `users`
  - `point-of-interests`
  - `amenities`
  - `categories`
  - `cities`
  - `countries`
  - `states`
  - `addresses`
  - `reviews`
- Select a type.
- For some types, you will be asked to select how many items to generate.
- Generating data for some types may require additional information. Follow on screen instructions and enter any required value to continue generating fake data.
- When you enter all the necessary values, script will generate data and insert it to the database.
- Script completes generating and inserting an item before it proceeds to the next item.
- Any error encountered during generating/inserting an item will terminate the script.
- Previously generated and successfully inserted data will be untouched, it will still be on the database.
- Some of the generation types does not require count value. These are actually hardcoded values. You can think of them as seeding the database with required(?) data.

## Recommended Generation Steps

- Data generation of some types may depend on other items and how many are there in the database.
- For example, creating `amenities-pois` type requires `amenities` and `pois` types to be generated first.
- To prevent frustration, here's a recommended order for generating different types of data (and how many to generate):
  - Amenities
  - Categories
  - Cities (Run `pkg/db/seed/cities.sql` manually)
  - Addresses (100K)
  - Users (100K)
  - Points of Interests (100K)
  - Amenities-Pois
  - Point of Interests Media

## Getting IDs

- For some types, you will be asked to enter a file that contains IDs of the objects you want to generate fake data for.
- For example, if you want to generate fake data for amenities-pois, you will be asked to enter a file that contains IDs of POIs.
- The file should contain one ID per line.
- Example: If you have created POIs in the database, you can get the IDs by running this command:

```bash
docker exec -i wl-postgres psql -d wanderlust -U postgres -c "SELECT id FROM pois" -o /home/file.txt
```

- This will create a file called `file.txt` in Docker container's home directory.
- Open Docker Desktop, click on the container, and click on "Files" tab.
- Navigate to `/home` directory.
- Right click on the `file.txt` file and select "Save".
- Select the location where you want to save the file.
- This file will **NOT** be in the correct format.
- Open this file in a text editor and alter the file to have one ID per line (and nothing else).
- Save the file.
- Now you can use this file as input for the script.

## Example Workflow

- Let's say you want to generate fake data for `users` type.
- Run `just fake`.
- Select `users` type.
- Select how many users to generate.
  - For example, if you select `1000`, script will generate 1000 users and insert them to the database.
  - For almost all types, you can select a large number (> 100K) to generate a lot of data efficiently.
- Script will batch generate random data and copy it to the database.

## Common Errors and Solutions

- If you encounter a lot of row collisions (primary key violations, unique constraint, etc.), you can try to decrease the step value to increase your chances of successfully inserting data.
