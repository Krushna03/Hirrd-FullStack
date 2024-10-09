import mongoose, { Schema } from "mongoose";

const savedJobSchema = new mongoose.Schema({
    user_id: {
       type: Schema.Types.ObjectId,
       ref: "User"
    },
    job_id: {
       type: Schema.Types.ObjectId,
       ref: "Job"
    }

}, {timestamps: true})

export const SavedJob = mongoose.model("SavedJob", savedJobSchema)