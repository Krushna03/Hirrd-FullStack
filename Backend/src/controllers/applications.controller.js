import { isValidObjectId } from "mongoose";
import { Application } from "../models/applications.js";
import { uploadPDFOnCloudinary } from "../utils/cloudinay.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const createApplication = async ( req, res) => {
     const {name, experience, skills, education, jobID, userID} = req.body
    //  const userID = req.user?._id

     if (!name) {
      throw new ApiError(400, "name is not provided")
     }
     if (!experience) {
      throw new ApiError(400, "experience is not provided")
     }
     if (!skills) {
      throw new ApiError(400, "skills is not provided")
     }
     if (!education) {
      throw new ApiError(400, "education is not provided")
     }
     if (!isValidObjectId(jobID)) {
      throw new ApiError(400, "jobID is not provided")
     }
     if (!isValidObjectId(userID)) {
      throw new ApiError(400, "userID is not provided")
     }

     const resumeLocalPath = req.file;

     if (!resumeLocalPath) {
      throw new ApiError(400, "resumeLocalPath is not provided")
     }

     const resume = await uploadPDFOnCloudinary(resumeLocalPath)

     if (!resume) {
       throw new ApiError(400, "resume is not provided")
     }

     const applied = await Application.create({
         name,
         skills,
         experience,
         education, 
         resume: resume?.url,
         job_id: jobID,
         candidate_id: userID
     })
     
     const result = await Application.findById(applied._id).select("-accessToken -refreshToken");


    //  const job = await Job.findById(jobID);
    //   if (!job) {
    //     throw new ApiError(404, "Job not found");
    //   }
    //   if (!Array.isArray(job.applications)) {
    //     job.applications = []; // Initialize as an empty array if undefined
    //   }
    //   // 4. Push the application ID to the job's applications array
    //   job.applications.push(result._id);
    //   // 5. Save the job after modifying the applications array
    //   await job.save();


     if (!result) {
       throw new ApiError(400, "applied not working")
     }

    return res.status(201)
               .json(new ApiResponse(200, result, "Applied to Job successfully"))
}




const getApplications = async (req, res) => {
  const { userID, jobId } = req.query; 

  if (!userID || !isValidObjectId(userID)) {
    throw new ApiError(400, "Invalid userID provided");
  }

  let query = { candidate_id: userID };
  if (jobId && isValidObjectId(jobId)) {
    query.job_id = jobId;
  }

  const applications = await Application.find(query).populate('job_id');

  if (!applications.length) {
    return res.status(404).json(new ApiResponse(404, [], "No applications found"));
  }

  return res.status(200).json(new ApiResponse(200, applications, "Applications fetched successfully"));
};



const getRecruiterApplications = async (req, res) => {
    const applications = await Application.find()

    if (!applications) {
      throw new ApiError(400, "Applications not found");
    }

    return res.status(200).json(new ApiResponse(200, applications, "Applications fetched successfully"));
}



const getAppliedJobs = async (req, res) => {
    const { userID } = req.query

    if (!userID) {
      throw new ApiError(400, "userID not found");
    }

    const appliedJobs = await Application.find({ candidate_id: userID }).populate({
         path: 'job_id',
         populate: {
            path: 'company_id',
            select: 'name logo_url'
         }
        })

    if(!appliedJobs) {
      throw new ApiError(400, "appliedJobs not found");
    }

    return res.status(200).json(new ApiResponse(200, appliedJobs, "appliedJobs fetched successfully"));
}


export { createApplication, getApplications, getRecruiterApplications, getAppliedJobs }