import express from "express";
import { limiter } from "./middlewares/rateLimit.middleware.js";


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(limiter)

//routes declaration
import chapterRoutes from "./routes/chapter.routes.js"

app.use("/api/v1", chapterRoutes)


export { app };
