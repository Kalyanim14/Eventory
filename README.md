# Eventory

Eventory is a requirement-posting experience for event planners, performers, and event crew. The repository contains two independently started applications:

```text
Eventory/
├── eventory/   # Next.js frontend
└── Backend/    # Express API and MongoDB persistence
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

2. Configure MongoDB for the API.

   Create `Backend/.env` with your own values. Do not commit this file.

   ```env
   MONGODB_URI=mongodb+srv://<username>:<url-encoded-password>@<cluster>/<database>?retryWrites=true&w=majority
   PORT=5000
   CORS_ORIGIN=http://localhost:3000
   ```

   In MongoDB Atlas, create a database user with read/write access and allow your development IP under **Network Access**.

3. Install backend dependencies and start the API.

   ```bash
   cd Backend
   npm ci
   npm run dev
   ```

   The API starts at `http://localhost:5000`. Confirm it is running by opening `http://localhost:5000/api/health`; it should return `{"status":"ok"}`.

4. Open a second terminal at the repository root, install frontend dependencies, and start Next.js.

   ```bash
   cd eventory
   npm ci
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser.

   The frontend calls `http://localhost:5000` by default. To use a different API URL, create `eventory/.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

## Useful commands

Run these from the relevant application directory.

| Application | Command | Purpose |
| --- | --- | --- |
| `eventory` | `npm run dev` | Start the Next.js development server |
| `eventory` | `npm run lint` | Run frontend linting |
| `eventory` | `npm run build` | Create a production frontend build |
| `Backend` | `npm run dev` | Start the Express API with file watching |
| `Backend` | `npm start` | Start the Express API normally |

## Troubleshooting

- **The page loads but submitting fails:** Make sure the API is running on port `5000`, `MONGODB_URI` is valid, and `CORS_ORIGIN` includes `http://localhost:3000`.
- **MongoDB connection fails:** Verify the Atlas password is URL-encoded and that the machine's IP address is allowed by Atlas network access rules.
- **Port already in use:** Change `PORT` in `Backend/.env`. If you change it from `5000`, set the same URL in `eventory/.env.local` using `NEXT_PUBLIC_API_URL`.
- **Fresh dependency install fails:** Delete only the affected application's `node_modules` directory, then rerun `npm ci` in that application.

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
- Run `npm run lint` and `npm run build` in `eventory/` before opening a pull request.
