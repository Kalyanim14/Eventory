import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app.js";
const port=process.env.PORT||5000;
mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(port,()=>console.log(`Eventory API listening on :${port}`))).catch(err=>{console.error("MongoDB connection failed",err.message);process.exit(1);});
