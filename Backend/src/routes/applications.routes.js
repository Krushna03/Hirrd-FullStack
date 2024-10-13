import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js'
import { createApplication, getApplications } from '../controllers/applications.controller.js'
import { upload } from '../middleware/multer.middleware.js'



const router = Router()

router.use(verifyJWT)

router.route("/createApplication").post(upload.single("resume") ,createApplication)

router.route("/getApplications").get(getApplications)

export default router;