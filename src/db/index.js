import mongoose from "mongoose";

//const dbName = "chapters"

const databaseConnection = async () => {
    
    try {
        const dbConnection = await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`)
        console.log(`Database is successfully connected to host: ${dbConnection.connection.host}`);
    } catch (err) {
        console.log("Error while connecting to database", err);
        process.exit(1)
    }
}

export { databaseConnection };