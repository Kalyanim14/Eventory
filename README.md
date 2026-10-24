# Eventory

Eventory is a requirement-posting experience for event planners, performers, and event crew. It is a single Next.js application: the UI and API routes run from the same server.

```text
eventory/
├── app/         # Next.js pages and API route handlers
├── components/  # Requirement wizard and UI primitives
├── lib/         # MongoDB connection and Zod validation
└── models/      # Mongoose models
```

## Prerequisites

- Node.js 20.9 or later (Node 22 LTS recommended)
- npm (included with Node.js)
- A MongoDB Atlas cluster or another reachable MongoDB deployment
- Git

## Run after cloning

1. Clone the repository and open its directory.

   ```bash
   git clone https://github.com/Kalyanim14/Eventory.git
   cd Eventory
   ```

2. Configure MongoDB.

   Copy the example environment file and add your own MongoDB connection string. Do not commit `.env.local`.

   ```bash
   cp .env.example .env.local
   ```

   ```env
   MONGODB_URI=mongodb+srv://<username>:<url-encoded-password>@<cluster>/<database>?retryWrites=true&w=majority
   ```

   In MongoDB Atlas, create a database user with read/write access and allow your development IP under **Network Access**.

3. Install dependencies and start Next.js.

   ```bash
   npm ci
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser. Confirm the API is available at `http://localhost:3000/api/health`; it should return `{"status":"ok"}`.

## Useful commands

Run these from the repository root.

| Command | Purpose |
| --- | --- | --- |
| `npm run dev` | Start the Next.js app and API routes |
| `npm run lint` | Run linting |
| `npm run build` | Create a production build |
| `npm start` | Start the production build |

## Troubleshooting

- **The page loads but submitting fails:** Make sure `MONGODB_URI` is valid and the development server has been restarted after editing `.env.local`.
- **MongoDB connection fails:** Verify the Atlas password is URL-encoded and that the machine's IP address is allowed by Atlas network access rules.
- **Port already in use:** Start Next.js on another port with `npm run dev -- --port 3001`.
- **Fresh dependency install fails:** Delete `node_modules`, then rerun `npm ci`.

## API quick reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | API health check |
| `POST` | `/api/requirements` | Create a validated requirement |
| `GET` | `/api/requirements` | List requirements; supports `?category=planner`, `performer`, or `crew` |
| `GET` | `/api/requirements/:id` | Retrieve one requirement by MongoDB ID |

## Before pushing changes

- Never commit `.env` or `.env.local` files.
- Never commit `node_modules/` or Next.js build output (`.next/`).
- Run `npm run lint` and `npm run build` before opening a pull request.
