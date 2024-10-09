import { Router } from "express";
import { upload } from '../middleware/multer.middleware.js'
import { createComapny, getCompanies } from "../controllers/companies.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router()
router.use(verifyJWT)


router.route('/newCompany').post(upload.single("logo_url"), createComapny)

router.route('/getCompanies').get(getCompanies)

export default router;