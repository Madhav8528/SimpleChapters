import mongoose from "mongoose";

const dbName = "chapters"

const databaseConnection = async () => {
    
    try {
        const dbConnection = mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}/${dbName}`)
        console.log(`Database is successfully connected to host: ${(await dbConnection).connection.host}`);
    } catch (err) {
        console.log("Error while connecting to database", err);
        process.exit(1)
    }
}

export { databaseConnection };