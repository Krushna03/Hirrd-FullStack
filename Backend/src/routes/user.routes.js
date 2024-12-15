import { addUserRole, getCurrentUser, getRecruiterDetails, getUserDeatils, logoutUser, registerUser, signInUser, googleLogin } from "../controllers/user.controller.js";
import {Router} from 'express'
import { verifyJWT } from "../middleware/auth.middleware.js";
import passport from "passport";


const router = Router()


router.route('/registeration').post(registerUser)

router.route('/signIn').post(signInUser)

router.route('/logout').post(verifyJWT, logoutUser)

router.route('/currentUser').get(verifyJWT, getCurrentUser)

router.route('/updateUserRole').patch(verifyJWT, addUserRole)

router.route('/getUserDeatils').get(getUserDeatils)

router.route('/getRecruiterDetails').get(getRecruiterDetails)

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}))


import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google/callback", async (req, res) => {
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

    // Find or create user
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
});


export default router