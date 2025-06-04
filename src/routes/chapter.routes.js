import { Router } from "express";
import { getChapters,
         getChapterById,
         uploadChapters } from "../controllers/chapter.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = Router()

//public routes
router.route("/chapters").get(getChapters)
router.route("/chapters/:id").get(getChapterById)

//admin only route
router.route("/chapters").post(isAdmin, upload, uploadChapters)


export default router;