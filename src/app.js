import express from "express";

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

//routes declaration
import chapterRoutes from "./routes/chapter.routes.js"

app.use("/api/v1", chapterRoutes)


export { app }
