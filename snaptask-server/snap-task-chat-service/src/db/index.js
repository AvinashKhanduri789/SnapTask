import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const connectionResponse = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("Successfull connected with db-->", connectionResponse.connection.host);
    } catch (e) {
        console.log("Error while trying to connect with db", e);
        process.exit(1);
    }
}