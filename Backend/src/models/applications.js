import mongoose, { Schema } from "mongoose";


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
      enum: ['Applied', 'Interviewing', 'Hired', 'Rejected'],
      default: "Applied"
   },
   education:{
      type: String,
      enum: ['Intermediate', 'Graduate', 'Post Graduate']
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