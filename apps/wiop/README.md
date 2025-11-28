# Wanderlust Image Optimization Proxy Server

## What is it?

- WIOP (Wanderlust Image Optimization Proxy) is a web server utilizing `ipx` to optimize and/or modify media requests on the fly.

## How to Run

- Make sure you have Node.js LTS and pnpm installed.
- Run `pnpm install` to install dependencies.
- Run `pnpm start` to start the server.
- The server will be running at `http://localhost:3002`.

## How to Use

- Prefix all the image URLs with `http://localhost:3002/`.
- Example: `http://localhost:3002/w_256/http://localhost:9000/pois/foo.jpg`.
- See the `ipx` documentation for more details: https://github.com/unjs/ipx
