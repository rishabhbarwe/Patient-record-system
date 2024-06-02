import { Router } from "express"

import { registerPatient  } from "../controllers/patient.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { asyncHandler } from "../utilities/asyncHandler.js"
import { loginPatient } from "../controllers/patient.controller.js"
import { logoutPatient } from "../controllers/patient.controller.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
             name: "avatar",
             maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }

    ]),
    registerPatient
 )
 router.route("/login").post(loginPatient)

 //secured routes
 router.route("logout").post(verifyJWT, logoutPatient)   //verification completed then goes to next means logoutPatient...


export default router
 