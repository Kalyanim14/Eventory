import mongoose from "mongoose";

const globalForMongoose = globalThis;

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!globalForMongoose.mongooseConnection) {
    globalForMongoose.mongooseConnection = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10_000,
    }).catch((error) => {
      globalForMongoose.mongooseConnection = undefined;
      throw error;
    });
  }

  await globalForMongoose.mongooseConnection;
  return mongoose.connection;
}
