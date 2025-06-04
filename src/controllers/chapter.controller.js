import { Chapters } from "../models/chapter.model.js";
import { redisClient } from "../utils/redisClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError }  from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

//tested
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
  if (weakChapters !== "") {
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

//tested
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

//tested
const uploadChapters = asyncHandler(async (req, res) => {
    
    if (!req.file){
      throw new ApiError(400, "No file uploaded")
    }

    let chapterData
    try {
      chapterData = JSON.parse(req.file.buffer.toString())
    } catch {
      throw new ApiError(400, "Invalid file passed, please provide a valid json file.")
    }
    //console.log("Total chapters in file", chapterData.length);
    

    if (!Array.isArray(chapterData)){
      chapterData = [chapterData]
    }
  
    const validationResults = await Promise.allSettled(
      chapterData.map(async (data) => {
        const doc = new Chapters(data, {strict : "throw"})
        await doc.validate()
        return doc
    }))
  
    const validChapters = []
    const failedChapters = []

    validationResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        validChapters.push(result.value)
      } else {
        failedChapters.push(chapterData[index])
      }
    })

    //console.log("Valid:", validChapters.length)
    //console.log("Failed:", failedChapters.length)

    if (validChapters.length > 0){

      await Chapters.insertMany(validChapters)

      const keys = await redisClient.keys("chapters*")
      if (keys.length > 0){
        await redisClient.del(keys)
      }
    }

    const responseData = {
      insertedChapters: validChapters.length,
      failed_to_upload_chapters: failedChapters.length
    }

    if (failedChapters.length > 0){

      responseData.failedChapters = failedChapters
      return res
        .status(207)
        .json(new ApiResponse(207, responseData, `Chapters uploaded with ${failedChapters.length} failures`)
      )
    }

    return res
      .status(200)
      .json(new ApiResponse(200, responseData, "All chapters uploaded successfully")
    )
})


export { getChapters,
         getChapterById,
         uploadChapters
};