import mongoose from "mongoose";

export function databaseSetup() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database is connected");
    })
    .catch(() => {
      console.log("Database is not connected. Something went wrong");
    });
}
