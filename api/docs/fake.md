# Fake Data Generation

## Prerequisites

- Make sure your database is up and running.

## Running

- Run `make generate-fake-data` command.
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
  - Addresses (100K)
  - Amenities
  - Categories
  - Countries
  - States
  - Cities
  - Users (100K)
  - Points of Interests (100K)
  - Amenities-Pois (100K)

## Example Workflow

- Let's say you want to generate fake data for `users` type.
- Run `make generate-fake-data`.
- Select `users` type.
- Select how many users to generate.
  - For example, if you select `1000`, script will generate 1000 users and insert them to the database.
  - For almost all types, you can select a large number (> 100K) to generate a lot of data efficiently.
- Script will batch generate random data and copy it to the database.

## Common Errors and Solutions

- If you encounter a lot of row collisions (primary key violations, unique constraint, etc.), you can try to decrease the step value to increase your chances of successfully inserting data.
