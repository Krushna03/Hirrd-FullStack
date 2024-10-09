import mongoose from "mongoose";


const companiesSchema = new mongoose.Schema({
   name: {
     type: String,
     required: true
   },
   logo_url: {
      type: String,
      required: true
   }
}, {timestamps: true})


export const Company = mongoose.model("Company", companiesSchema)