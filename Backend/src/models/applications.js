import mongoose from "mongoose";


const applicationSchema = new mongoose.Schema({
   name: {
     type: String,
     required: true
   },
   skills: {
      type: String,
      required: true
   },
   experience: {
      type: Number,
      required: true
   },
   status: {
      type: String,
      enum: ['APPLIED, INTERVIEWING, HIRERED, REJECTED']
   },
   education:{
      type: String,
      enum: ['NTERMEDIATE, GRADUATE, POST GRADUATE']
   },
   resume: {
      type: String,
      required: true,
   },
   job_id: {
      type: Schema.Types.ObjectId,
      ref: "Job"
   },
   candidate_id: {
      type: Schema.Types.ObjectId,
      ref: "User"
   },
   
}, {timestamps: true})


export const Application = mongoose.model("Application", applicationSchema)