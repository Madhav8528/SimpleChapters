import mongoose, { Schema } from "mongoose";


const chapterSchema = new Schema({

    subject : {
        type : String,
        required : true
    },
    chapter : {
        type : String,
        required : true
    },
    class : {
        type : String,
        required : true
    },
    unit : {
        type : String,
        required : true
    },
    yearWiseQuestionCount : {
        type : Object,
        required : true
    },
    questionSolved : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : ["Not Started", "Completed", "In Progress"]
    },
    isWeakChapter : {
        type : Boolean,
        required : true
    }
},
{
    timestamps : true
})

export const Chapters = mongoose.model("Chapters", chapterSchema)