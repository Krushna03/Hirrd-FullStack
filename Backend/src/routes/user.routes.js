import { addUserRole, getCurrentUser, getRecruiterDetails, getUserDeatils, logoutUser, registerUser, signInUser } from "../controllers/user.controller.js";
import {Router} from 'express'
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router()


router.route('/registeration').post(registerUser)

router.route('/signIn').post(signInUser)

router.route('/logout').post(verifyJWT, logoutUser)

router.route('/currentUser').get(verifyJWT, getCurrentUser)

router.route('/updateUserRole').patch(verifyJWT, addUserRole)

router.route('/getUserDeatils').get(getUserDeatils)

router.route('/getRecruiterDetails').get(getRecruiterDetails)


export default router