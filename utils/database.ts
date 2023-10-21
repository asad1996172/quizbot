import mongoose from "mongoose";

let isConnected = false;
export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log("Mongo db is already connected !!");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "quizbot",
        });
        isConnected = true
        console.log("Mongo db is connected !!");
    } catch (error) {
        console.log(error);
        console.log("Error connecting to mongo db");
    }
}