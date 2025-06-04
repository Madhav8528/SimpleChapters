import { Chapters } from "../models/chapter.model.js";
import { redisClient } from "../utils/redisClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError }  from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";


const getChapters = asyncHandler(async (req, res) => {
    
    const {
    class: classFilter,
    unit,
    subject,
    status,
    weakChapters,
    page = 1,
    limit = 10,
  } = req.query

  const queryObj = {}

  if (classFilter){
    queryObj.class = classFilter
  }
  if (unit){ 
    queryObj.unit = unit
  }
  if (subject){ 
    queryObj.subject = subject
  }
  if (status){ 
    queryObj.status = status
  }
  if (weakChapters !== undefined) {
    if (weakChapters === "true" || weakChapters === "false") {
      queryObj.isWeakChapter = weakChapters === "true"
    } else {
      throw new ApiError(400, "Invalid value for weakChapters. Use true or false.")
    }
  }

  const skip = (parseInt(page) - 1) * parseInt(limit)
  const cacheKey = `chapters:${JSON.stringify({ ...queryObj, page, limit })}`

  
  const cachedData = await redisClient.get(cacheKey)
  if (cachedData) {
    const parsedData = JSON.parse(cachedData)
    return res
      .status(200)
      .json(new ApiResponse(200, parsedData, "Chapters fetched from cache"));
  }

  const [chapters, totalCount] = await Promise.all([
    Chapters.find(queryObj).skip(skip).limit(parseInt(limit)),
    Chapters.countDocuments(queryObj),
  ])

  const result = { totalCount, chapters }

  
  await redisClient.setEx(cacheKey, 60 * 60, JSON.stringify(result))

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Chapters fetched successfully"));
});


const getChapterById = asyncHandler( async (req, res) => {
    
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid chapter id, please provide a valid id.")
    }

    const chapter = await Chapters.findById(id)

    if (!chapter) {
        throw new ApiError(404, "No chapter found with this id.")
    }

    return res
      .status(200)
      .json(new ApiResponse(200, chapter, "Chapter fetched successfully."));

})




export { getChapters,
         getChapterById
};