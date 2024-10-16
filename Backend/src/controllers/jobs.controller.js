import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Company } from '../models/companies.model.js'
import { Job } from '../models/jobs.model.js'
import { isValidObjectId } from 'mongoose'
import { User } from '../models/user.model.js'


const createJob = async (req, res) => {
     const {title, description, location, requirement, company_Name} = req.body;

     const userID = req.user?._id

     if ([title, description, location, requirement, company_Name].some(filed => !filed)) {
      throw new ApiError(404, "title, description, location, requirement, company_Name is not provided ") 
     }

     const company = await Company.findOne({ name: company_Name})
    
     const job = await Job.create({
      title,
      description,
      location,
      requirement,
      company_id: company._id,
      recuriter_id: userID,
     })

     if (!job) {
      throw new ApiError(404, "Job is not created")
     }

    return res.status(201)
            .json(new ApiResponse(200, job, "Job created successfully"))
}



const getJobs = async (req, res) => {

    const jobs = await Job.find().populate("company_id", "logo_url")

    if (!jobs) {
      throw new ApiError(400, "jobs are not available")
    }

    return res.status(201)
              .json(new ApiResponse(200, jobs, "Jobs fetched successfully"))
}



const getJobById = async (req, res) => {
    const { jobId } = req.params;

    if (!isValidObjectId(jobId)) {
      throw new ApiError(400, "jobId is not provided")
    }

    const job = await Job.findById(jobId).populate("company_id", "logo_url name")

    if(!job){
      throw new ApiError(400, "job not found")
    }

    return res.status(201)
              .json(new ApiResponse(200, job, "Job fetched successfully"))
}



const getJobsBySearch = async (req, res) => {
    const {title, location, company_Name} = req.query

    if (!title || !location || !company_Name) {
      throw new ApiError(404, "title || location || company_Name is not provided")
    }

    //  if (!title) {
    //    throw new ApiError(404, "title is not provided")
    //  }
    //  if (!location) {
    //    throw new ApiError(404, "location is not provided")
    //  }
    //  if (!company_Name) {
    //    throw new ApiError(404, "company_Name is not provided")
    //  }

    const company = await Company.findOne({ name: company_Name})
    const company_id = company._id

    const jobs = await Job.find({
        $and: [ {title}, {location}, {company_id} ]
    }).populate("company_id", "logo_url")

    if (!jobs) {
      throw new ApiError(404, "jobs not found")
    }

    return res.status(201)
              .json(new ApiResponse(200, jobs, "Jobs fetched by search successfully"))
}




const getMyJobs = async (req, res) => {
     const { userID } = req.query;

     if (!userID) {
      throw new ApiError(404, "userID not found")
     }

     const myJobs = await Job.find({ recuriter_id: userID }).populate("company_id")

     if (!myJobs) {
        throw new ApiError(404, "myJobs not found")
     }

     return res.status(201)
              .json(new ApiResponse(200, myJobs, "My-Jobs fetched successfully"))
}




const updateJobStatus = async (req, res) => {
    const { jobId } = req.params;
    const { iOpen } = req.body;

    const job = await Job.findByIdAndUpdate(jobId, 
      { 
        $set: {
          iOpen: iOpen
        }
      }, 
      { 
        new: true 
      }
    );

    if (!job) {
      return res.status(404).send("Job not found");
    }

    return res.status(201)
              .json(new ApiResponse(200, job, "Job status updated successfully"))
}



const CreateSavedJob = async (req, res) => {
  const { jobID, userID } = req.body

  if (!isValidObjectId(jobID)) {
    throw new ApiError(400, "jobID does not Exists")
  }
  if (!userID) {
    throw new ApiError(400, "userID does not Exists")
  }

  const jobSaved = await Job.findByIdAndUpdate(jobID,
     {
       $set: {
         isSaved: true 
       }
     }, 
     {
       new: true
     }  
  );

  const userUpdated = await User.findByIdAndUpdate(
    userID,
    { 
      $addToSet: 
          { 
            savedJobs: jobID 
          } 
    }, 
    { 
       new: true 
    }
  );

  if (!jobSaved) {
    throw new ApiError(400, "job not saved")
  }

  if (!userUpdated) {
    throw new ApiError(400, "user not updated")
  }

  const response = {
    message: "Job saved successfully",
    job: jobSaved, 
    user: {
      id: userUpdated._id,
      savedJobs: userUpdated.savedJobs
    }
  };

  res.status(200)
     .json(new ApiResponse(201, response, "Job saved successFully"))
}



const getSavedJobs = async (req, res) => {
  const { userID } = req.query;
   
  if (!userID || !isValidObjectId(userID)) {
    throw new ApiError(400, "userID does not Exists")
  }

  const user = await User.findById(userID).populate({
    path: 'savedJobs',
    populate: {
      path: 'company_id',
      select: 'name logo_url' // Add any other company fields you need
    }
  })

  if (!user) {
    throw new ApiError(400, "savedjobs not get")
  }

  const savedJobs = user.savedJobs || [];

  if (!savedJobs) {
    throw new ApiError(400, "savedjobs not found or empty")
  }

  res.status(200)
     .json(new ApiResponse(201, savedJobs, "Job saved successFully"))
}



const unSaveJob = async (req, res) => {
  const { jobID } = req.body
  const userID = req.user?._id

  if (!isValidObjectId(jobID)) {
    throw new ApiError(400, "jobID does not Exists")
  }
  if (!isValidObjectId(userID)) {
    throw new ApiError(400, "userID does not Exists")
  }

  const jobUnSaved = await User.findByIdAndUpdate(userID,
     {
       $pull: {
         savedJobs: jobID 
       }
     }, 
     {
       new: true
     }  
  );

  if (!jobUnSaved) {
    throw new ApiError(400, "job not unSaved")
  }

  res.status(200)
     .json(new ApiResponse(201, { jobID }, "Job UnSaved successFully"))
}



const deleteJob = async (req, res) => {
     const { jobID } = req.query;

     if (!isValidObjectId(jobID)) {
      throw new ApiError(400, "jobID not unSaved")
     }

     const deletedJob = await Job.findByIdAndDelete(jobID)
     
    if (!deleteJob) {
      throw new ApiError(400, "deleteJob facing error")
    }
     
    res.status(200)
       .json(new ApiResponse(201, deleteJob, "Job deleted successFully"))
}


export { createJob, getJobs, getJobById, getJobsBySearch, getMyJobs,updateJobStatus, getSavedJobs, CreateSavedJob, unSaveJob, deleteJob }