# Wanderlust IPX

## What is it?

- WIOP (Wanderlust Image Optimization Proxy) is a web server utilizing `ipx` to optimize and/or modify media requests on the fly.

## How to Run

- Run `bun dev` to start the development server.
- The server will be running at `http://localhost:3002`.

## How to Use

- Prefix all the image URLs with `http://localhost:3002/`.
- Example: `http://localhost:3002/w_256/http://example.com/foo.png`.
- See the `ipx` documentation for more details: https://github.com/unjs/ipx
