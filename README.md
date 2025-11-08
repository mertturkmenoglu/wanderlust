<div style="display: flex; justify-content: center; align-items: center;">
  <img width="192" src="https://raw.githubusercontent.com/mertturkmenoglu/wanderlust/main/web/public/logo.png" alt="Wanderlust logo" />
</div>

# Wanderlust

Welcome to Wanderlust, a travel and location discovery platform designed to inspire exploration and connection. With Wanderlust, you can:

- Explore cities and places (POI) guides, curated with insider tips and recommendations.
- Collect and organize places into favorites, bookmarks, and custom lists.
- Follow fellow travelers, send messages, and stay up-to-date on their adventures.
- Plan future trips using our intuitive trip planner tool.
- Search and filter results using powerful facets and filters.

It's open source and free.

(Yes, AI wrote this section. Duh.)

## Features

- Exploration:
  - Search for places.
  - Explore cities and countries.
  - Explore places/point of interests (POIs).
  - Explore places by category.
  - Explore curated collections of places.
  - Discover nearby places.
- User:
  - Create an account.
  - Follow other users.
  - Customize your profile, add information about yourself.
  - Add favorite places to your profile.
  - Use custom profile and banner images.
  - View other users':
    - Profile
    - Reviews
    - Recent Activities
    - Top locations
    - Favorites
    - Public Lists
- Reviews:
  - Create reviews.
  - Rate places.
  - Upload images.
  - Filter reviews by rating and date.
  - Sort reviews by rating and date.
- Lists, Bookmarks, Favorites:
  - Create lists.
  - Add places to your lists.
  - View other users' public lists.
  - Create bookmarks.
  - Add places to your favorites.
- Trip planning:
  - Create trips.
  - Add places to your trips.
  - Invite friends to your trips.
  - View other users' trips.
  - Add requested amenities.
  - Comment on trips.

## Planned Features

- Notifications.
- In app messaging.
- Trip itinerary.
- Better place and user search.
- Better map interactions.
- Better place reviews.
- Better L10n support.
- Better timezone support.

## Screenshots

### Homepage

<img src="https://i.imgur.com/kGinaVY.png" alt="Homepage" width="100%">

### Places

<img src="https://i.imgur.com/004GWJJ.png" alt="Places" width="100%">
<img src="https://i.imgur.com/aDkugS0.png" alt="Places" width="100%">
<img src="https://i.imgur.com/7gvZwGl.png" alt="Places" width="100%">
<img src="https://i.imgur.com/QQMJLai.png" alt="Places" width="100%">

### Trip Planner

<img src="https://i.imgur.com/Lc0qx1V.png" alt="Trip Homepage" width="100%">
<img src="https://i.imgur.com/hp7CT9q.png" alt="Trip Details" width="100%">

### User Profile

<img src="https://i.imgur.com/XVH6w4C.png" alt="User Profile" width="100%">

### Search

<img src="https://i.imgur.com/lEvVdE0.png" alt="Search" width="100%">
<img src="https://i.imgur.com/aEJjOs0.png" alt="Nearby Locations" width="100%">

### Countries and Cities

<img src="https://i.imgur.com/WPZpdXZ.png" alt="Cities" width="100%">
<img src="https://i.imgur.com/89srSoL.png" alt="Countries" width="100%">

### Bookmarks and Lists

<img src="https://i.imgur.com/ytravad.png" alt="Bookmarks" width="100%">
<img src="https://i.imgur.com/guJKY9K.png" alt="Lists" width="100%">

## Requirements

- Docker (https://docs.docker.com/desktop/setup/install/linux/ubuntu/)
- Go (https://go.dev/dl/)
- sqlc (https://sqlc.dev/)
- Just (https://github.com/casey/just)
- Air (https://github.com/air-verse/air)
- Goose (https://github.com/pressly/goose)
- Node.js (https://nodejs.org/en/download)
- pnpm (https://pnpm.io/installation)
- Concurrently (https://www.npmjs.com/package/concurrently)

Optional:

- gosec (https://github.com/securego/gosec)
- staticcheck (https://staticcheck.dev/docs/getting-started/)

## Installation and Running

- Check each subproject's README file.
- Make sure you have all the requirements installed.
  - You can run `requirements.sh` script to check if you have all the requirements installed.
  - `chmod u+x ./requirements.sh && ./requirements.sh`
  - Start Docker service or Docker Desktop.
- Run `just setup` to setup the project.
- Run `just watch` to start the servers.

## License

OpenStreetMap is open data, licensed under the Open Data Commons Open Database License (ODbL). See the [full license text](https://opendatacommons.org/licenses/odbl/1.0/) for details.

Wikipedia content is available under the Creative Commons Attribution-ShareAlike License v3.0 (CC-BY-SA-3.0). See the [full license text](https://creativecommons.org/licenses/by-sa/3.0/) for details.

Wanderlust is using a modified MIT license. See the [LICENSE](LICENSE) file for license rights and limitations.

## Contact Us

- **Email** - Contact us through withwanderlustapp [at] proton [dot] me

## Contributing

- If you appreciate the work, please don't hesitate to contribute, reach out, share the project.
- You can also help us by spreading the word about the project.
- For more information, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## SEO Strings

A few words in English and Turkish for SEO.

- Trip planning
- Trip planner
- Point of Interest
- Location discovery
- Explore locations
- Seyahat planlama
- Seyahat planlayıcı
- Gezilecek yerler
- İlginç yerleri keşfedin
