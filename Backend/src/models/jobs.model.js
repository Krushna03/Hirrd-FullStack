import mongoose, { Schema } from "mongoose";

const JobSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   location: {
      type: String,
      required: true,
   }, 
   requirement: {
      type: String,
      required: true,
   },
   iOpen: {
      type: Boolean,
      default: true,
   },
   company_id: {
      type: Schema.Types.ObjectId,
      ref: "Company"
   },
   recuriter_id: {
      type: Schema.Types.ObjectId,
      ref: "User"
   },
   isSaved: {
      type: Boolean,
      default: false
   },

}, {timestamps: true})

export const Job = mongoose.model("Job", JobSchema)