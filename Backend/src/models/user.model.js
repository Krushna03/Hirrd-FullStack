import mongoose, {Schema} from 'mongoose' 
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema({
    username: {
       type: String,
       required: true,
       lowercase: true,
       unique: true,
       trim: true
    },
    email: {
       type: String,
       required: true,
       lowercase: true,
       unique: true,
       trim: true
    },
    password: {
       type: String,
       required: true,
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter"],
      default: null,
    },
    refreshToken: {
      type: String
    },
    savedJobs: [
      { 
         type: Schema.Types.ObjectId, 
         ref: "Job" 
      }
    ],
   //  AppliedJobs: [
   //    {
   //       type: Schema.Types.ObjectId,
   //       ref: "Application"
   //    }
   //  ]
    

}, {timestamps: true})


userSchema.index({ savedJobs: 1 });


userSchema.pre("save", async function(next) {
   if(!this.isModified("password")) return next()

   this.password = await bcrypt.hash(this.password, 10)
   next()
})


userSchema.methods.isPasswordCorrect = async function(password) {
   return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function() {
   return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
      process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
   )
}


userSchema.methods.generateRefreshToken = function() {
   return jwt.sign(
      {
        _id: this._id,
      },
       process.env.REFRESH_TOKEN_SECRET,
      {
       expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
   )
}


export const User = mongoose.model("User", userSchema)