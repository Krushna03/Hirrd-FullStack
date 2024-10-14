import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js'
import { createApplication, getApplications, getAppliedJobs, getRecruiterApplications } from '../controllers/applications.controller.js'
import { upload } from '../middleware/multer.middleware.js'



const router = Router()

router.use(verifyJWT)

router.route("/createApplication").post(upload.single("resume") ,createApplication)

router.route("/getApplications").get(getApplications)

router.route('/getRecruiterApplications').get(getRecruiterApplications)

router.route('/getAppliedJobs').get(getAppliedJobs)

export default router;