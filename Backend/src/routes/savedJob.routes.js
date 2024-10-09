import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { CreateSavedJob, getSavedJobs, removeSavedJob } from "../controllers/savedJobs.controller.js";


const router = Router()

router.use(verifyJWT)

router.route('/createSavedJob').post(CreateSavedJob)

router.route('/getSavedJobs').get(getSavedJobs)

router.route('/unSaveJob').delete(removeSavedJob)

export default router;