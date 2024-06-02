import { ApiError } from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Patient } from "../../Models/patient.models.js";
import { loginPatient } from "../controllers/patient.controller.js";



export const verifyJWT = asyncHandler(async (req,res,next) => {  //After login user has accesstoken ,refreshtoken
                                                                 //on the basis of tokens we can verify true user
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","") //only need token...authorization gives Bearer<space><token>
          //req.header if cliet is mobile application so header is sended, have to cover all edge cases
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) //if there is token then verifye it
    
        const patient = await Patient.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!patient){
            throw new ApiError(401, "Invalid Access Token")
    
        }
        req.patient = patient   //new object created patient in request ,in user login project we create user object...
        next()
    } catch (error) {

        throw new ApiError(401, ERROR?.message || "invalid access token")
        
    }  

})
