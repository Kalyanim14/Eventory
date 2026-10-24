# Eventory API

## MongoDB Atlas setup

1. Create a free account at [MongoDB Atlas](https://cloud.mongodb.com) and create an **M0 Free** cluster.
2. Under **Database Access**, create an application user with `readWrite` access.
3. Under **Network Access**, add your IP address. Only for a short demo, you may allow `0.0.0.0/0`; remove it afterward.
4. Select **Connect → Drivers → Node.js** and copy the connection string.
5. Copy `.env.example` to `.env`; set `MONGODB_URI` to the copied URI and replace `<password>` with your URL-encoded password.

Example:

```env
MONGODB_URI=mongodb+srv://eventory-app:YOUR_ENCODED_PASSWORD@cluster0.example.mongodb.net/eventory?retryWrites=true&w=majority
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

## Run

```bash
npm install
npm run dev
```
