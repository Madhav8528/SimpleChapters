import { app } from "./app.js";
import { databaseConnection } from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path : "./.env"
})

const serverPort = process.env.PORT || 5050

databaseConnection()
.then(
    app.listen(serverPort, () => {
        console.log(`App server is started on port: ${serverPort}`);
    })
)
.catch((err) => {
    console.log("Error while starting app server: ", err);
})