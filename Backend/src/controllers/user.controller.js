import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Application } from '../models/applications.js'
import { isValidObjectId } from 'mongoose'
import { Job } from '../models/jobs.model.js'
import { OAuth2Client } from 'google-auth-library';


const generateAccessAndRefreshTokens = async (userID) => {
   try {
      const user = await User.findById(userID)

      const accessToken = await user.generateAccessToken()
      const refreshToken = await user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false}) 

      return {accessToken, refreshToken}

   } catch (error) {
     throw new ApiError(500, "Something wend wrong while generating access and refresh token")
   }
}



const registerUser = async (req, res) => {
   const { username, email, password} = req.body;


   if ([username, email, password].some((filed) => filed?.trim() === "")) {
    throw new ApiError(400, "All fields are required") 
 }

  const existedUser = await User.findOne({
     $or: [ {username}, {email} ]
  })

  if (existedUser) {
    throw new ApiError(400, "The User Already Exists")
  }

  const user = await User.create({
     username: username,
     email: email,
     password: password,
  })

  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  const options = {
   httpOnly: true,
   secure: true,
   sameSite: 'none',
}

  return res
         .status(201)
         .cookie('accessToken', accessToken, options)
         .cookie('refreshToken', refreshToken, options)
         .json(
            new ApiResponse(
               200, 
               {
                  createdUser, 
                  accessToken
               },
              'User registered sucessfully'
         )
   )
}



const signInUser = async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
      throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
      throw new ApiError(404, "User does not exist")
    }

    const isPaswordValidate = await user.isPasswordCorrect(password)

    if (!isPaswordValidate) {
      throw new ApiError(404, "User password does not matched")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
  }

  return res.status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(
               new ApiResponse(
                  200,
                  {
                     user: loggedInUser, 
                     accessToken, 
                     refreshToken
                  },
                  "User logged In successFully"
               )
            )
}




const logoutUser = async ( req, res ) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
         $unset: {
            refreshToken: 1
         }
      },
      {
         new: true
      }
    )

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
   }

    return res.status(200)
              .clearCookie("accessToken", options)
              .clearCookie("refreshToken", options)
              .json(
                 new ApiResponse(200, {}, "User Logged used successfully")
              )
}




const getCurrentUser = async (req, res) => {
   const user = req.user;

   return res.status(200)
             .json(
               new ApiResponse(200, user, "User fetched successfully")
             )
}



const getUserDeatils = async (req, res) => {
   const { userID } = req.query

   if (!isValidObjectId(userID)) {
      throw new ApiError(404, "user not found")
   }
   
   // const savedJobs = await SavedJob.find({ user_id: userID })

   const userApplications = await Application.find({ candidate_id: userID})

   // if (!savedJobs) {
   //    throw new ApiError(404, "savedJobs not found")
   // }
   if (!userApplications) {
      throw new ApiError(404, "savedJobs not found")
   }

   return res.status(200)
             .json(
               new ApiResponse(200, { userApplications}, "User details fetched successfully")
             )
}



const getRecruiterDetails = async (req, res) => {
   const { userID } = req.query;
 
   if (!isValidObjectId(userID)) {
     throw new ApiError(404, "User not found");
   }
 
   const myJobs = await Job.find({ recuriter_id: userID });
 
   if (!myJobs || myJobs.length === 0) {
     throw new ApiError(404, "No jobs found for this recruiter");
   }
 
   const jobIds = myJobs.map((job) => job._id);
 
   const applications = await Application.find({ job_id: { $in: jobIds } });
 
   return res.status(200)
             .json(new ApiResponse(200, { myJobs, applications }, "User details fetched successfully")
           );
 };
 


const addUserRole = async (req, res) => {
    const { role } = req.body

    if (!role || !['candidate', 'recruiter'].includes(role)) {
      throw new ApiError(404, "Role is not provided")
    }

    const updatedRole = await User.findByIdAndUpdate(req.user?._id, 
      {
         $set: {
            role: role,
            isOnboardingComplete: true
         }
      },
      {
         new: true
      }
   ).select("-password -refreshToken")

   return res.status(200)
             .json( new ApiResponse(200, updatedRole, "User's role updated successfully")
    )
}



const googleLogin = async (req, res) => {
   const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

   try {
      const { token } = req.body;
      
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      const googleId = payload['sub'];
      const email = payload['email'];
      const username = payload['name'];
  
      let user = await User.findOne({ googleId });
      
      if (!user) {
        user = await User.create({
          username,
          email,
          googleId,
          password: Math.random().toString(36).slice(-8),
          isOnboardingComplete: false
        });
      }
  
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      };
  
      return res.status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json({
          accessToken,
          refreshToken,
          user: {
            _id: user._id,
            username: user.username,
            email: user.email
          }
        });
  
    } catch (error) {
      console.error('Google login error:', error);
      return res.status(500).json({ 
        message: 'Google login failed', 
        error: error.message 
      });
    }

}


export { registerUser, signInUser, logoutUser, getCurrentUser, getUserDeatils,addUserRole, getRecruiterDetails, googleLogin }