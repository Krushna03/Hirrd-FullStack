import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js'
import { changeApplicationStatus, createApplication, getApplications, getAppliedJobs } from '../controllers/applications.controller.js'
import { upload } from '../middleware/multer.middleware.js'



const router = Router()

router.use(verifyJWT)

router.route("/createApplication").post(upload.single("resume") ,createApplication)

router.route("/getApplications").get(getApplications)

router.route('/getAppliedJobs').get(getAppliedJobs)

router.route("/changeApplicationStatus").put(changeApplicationStatus)

export default router;