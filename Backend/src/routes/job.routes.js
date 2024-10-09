import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createJob, getJobs, getJobById, getJobsBySearch, updateJobStatus, getSavedJobs, CreateSavedJob, unSaveJob } from "../controllers/jobs.controller.js";


const router = Router()

router.use(verifyJWT)


router.route('/createJob').post(createJob)

router.route('/getJobs').get(getJobs)

router.route('/getJobsBySearch').get(getJobsBySearch)

router.route('/getJobById/:jobId').get(getJobById)

router.route('/getJobById/:jobId/updateJobStatus').patch(updateJobStatus)

router.route('/createSavedJob').post(CreateSavedJob)

router.route('/getSavedJobs').get(getSavedJobs)

router.route('/unSaveJob').delete(unSaveJob)

export default router