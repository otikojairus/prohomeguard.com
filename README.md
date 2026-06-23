# ProHomeGuard

Next.js site for customer-first home and property service pages covering emergency response, painting, flooring, tree care, and related local routes.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run start
```

## Docker

Build and run with Compose:

```bash
docker compose up --build
```

The container serves the app on `http://localhost:3000`.

Build the image directly:

```bash
docker build -t prohomeguard:latest .
docker run --rm -p 3000:3000 prohomeguard:latest
```
