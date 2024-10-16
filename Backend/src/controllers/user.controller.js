import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'


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

   console.log(username);
   console.log(req.body);

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
   secure: true
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
      secure: true
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
      secure: true
   }

    return res.status(200)
              .clearCookie("accessToken", options)
              .clearCookie("refreshToken", options)
              .json(
                 new ApiResponse(200, {}, "User Logged used successfully")
              )
}


const getCurrentUser = async(req, res) => {
   const user = await req.user.populate('savedJobs');

   return res
          .status(200)
          .json(
            new ApiResponse(200, user, "User fetched successfully")
          )
}


const addUserRole = async (req, res) => {
    const { role } = req.body

    if (!role || !['candidate', 'recruiter'].includes(role)) {
      throw new ApiError(404, "Role is not provided")
    }

    const updatedRole = await User.findByIdAndUpdate(req.user?._id, 
      {
         $set: {
            role: role
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



export { registerUser, signInUser, logoutUser, getCurrentUser, addUserRole }