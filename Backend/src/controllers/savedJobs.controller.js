import { SavedJob } from "../models/SavedJobs.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId } from "mongoose";


const CreateSavedJob = async (req, res) => {
  const { jobID, userID } = req.body

  if (!isValidObjectId(jobID)) {
    throw new ApiError(400, "jobID does not Exists")
  }
  if (!userID) {
    throw new ApiError(400, "userID does not Exists")
  }

  const jobSaved = await SavedJob.create({
    user_id: userID,
    job_id: jobID
  })

  if (!jobSaved) {
    throw new ApiError(400, "job not saved")
  }

  res.status(200)
     .json(new ApiResponse(201, jobSaved, "Job saved successFully"))
}


const getSavedJobs = async (req, res) => {
    const { userID } = req.query;
     
    if (!userID || !isValidObjectId(userID)) {
      throw new ApiError(400, "userID does not Exists")
    }

    const getJobs = await SavedJob.find({ user_id: userID }).populate({
                    path: 'job_id',
                    populate: {
                        path: 'company_id', 
                        model: 'Company',
                    },
                  }).populate('user_id')

    if (!getJobs) {
      throw new ApiError(400, "savedjobs not get")
    }

    res.status(200)
       .json(new ApiResponse(201, getJobs, "Job saved successFully"))
}


const removeSavedJob = async (req, res) => {
   const { jobID } = req.body;

   if (!isValidObjectId(jobID)) {
    throw new ApiError(400, "jobID not provided")
   }

   try {
      await SavedJob.findByIdAndDelete(jobID)
   } 
   catch (error) {
      throw new ApiError(400, "Job not unSaved")
   }

   res.status(200)
       .json(new ApiResponse(201, {}, "Job unSaved successFully"))
}


export { CreateSavedJob, getSavedJobs, removeSavedJob }