import { response } from "express";
import { DB_NAME } from "../constants.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { createConnection } from "mongoose";
import { ApiError } from "../utilities/ApiError.js"
import { Patient } from "../../Models/patient.models.js";
import { uploadOnCloudinary } from "../utilities/cloudinary.js"
import { ApiResponse } from "../utilities/ApiResponse.js";


const registerPatient = asyncHandler( async (req, res)=>{

   
        // message: "ok"
        // get user details from user
        // validations(empty field, wrong input)
        // check if user already exists
        // check for images,check for avatars
        // upload then to cloudinary
        // create user-object, create entry in db
        // remove password and refresh access token field from response
        // check for user creation
        // return response
        const { name, age} = req.body
        console.log("name: ",name)
        console.log("age: ",age)

        // Validations

        // if(name === ""){
        //     throw new ApiError(400, "name is required")

        // }
        // if(age === ""){
        //     throw new ApiError(400, "age is required")
        // }

        //  or to validation all fiels in a single if ,can use
        if([name, age].some((field)=>
            field?.trim()==="")){
                throw new ApiError(400, "All fields are required")
            }

        // i am validating and checking name and age and i know this is not proper checking because
        // validations are done on Emails or Usernames.
        //But i have not mention anywhere username or Email thats why i am using name and age everywhere
        // in future i will change it.
        
      //check if user already exist

      const existedUser = await Patient.findOne({
        $or: [{name},{age}]
      })
      if(existedUser){
        throw new ApiError(409, "Patient with name or age already exist")
      }

      // check for images, check for avatars

      const avatarLocalPath = req.files?.avatar[0]?.path; //path of images/avatar
      const coverImageLocalPath = req.files?.coverImage[0]?.path;

      if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
      }

      // upload then to cloudinary
      const avatar = await uploadOnCloudinary(avatarLocalPath)
      const coverImage = await uploadOnCloudinary(coverImageLocalPath)

      if(!avatar){
        throw new ApiError(400, "Avatar file is required")
      }

      // create user-object, create entry in db  
      const patient = await Patient.create({
        name,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        age,
        diagonsedWith,
        bloodGroup,
        gender,
        admittedIn,
      })
      
      const createdPatient = await Patient.findById(user._id).select(
        "-age -refreshToken"         //age ki jagah password hona tha but qki password nahi return krna h
                                     // password mene use hi nahi kiya h to example ke liye age likh diya... 
      )

      if(!createdPatient){
        throw new ApiError(500, "Something went wrong while registering Patient")
      }

      // return response
      
      return res.status(201).json(
        new ApiResponse(200, createdPatient, "Patient registered Successfully")
      )




})

//backend part two....
//Creating login user not here the user is patient in my case...

const loginPatient = asyncHandler(async (req,res)=>{
      // req body->data
      //username / email
      //find the user
      //password check
      //access and refresh token
      //send cookie

      const {email, username, password} = req.body

      if(!(username || email)){
        throw new ApiError(400, "Username or email is required");
      }

      const patient = await Patient.findOne({  //capital Patient is a mongoose object...
        $or: [{username}, {email}]
      })

      if(!patient){
        throw new ApiError(404, "patient does not exist")  
      }

      const isPasseordValid = await patient.isPasswordCorrect(password) //but our defined methods apply on returned patient...
      if(!isPasseordValid){
        throw new ApiError(401, "password incorrect")  
      }
      const {accessToken, refreshToken } = await generateAccessAndRefreshTokens(patient._id)
      const loggedInPatient = await Patient.findById(patient._id).select("-password -refreshToken")

      const options = {
        httpOnly: true,   //cookies are modiafiable at only server end if httponly:true and secure: true,
        secure: true
      }
      return res
      .status(200)
      .cookie("accessToken",accessToken, options)
      .cookie("refreshToken",refreshToken, options)
      .json(
        new ApiResponse(200,
          {
            user: loggedInPatient, accessToken, refreshToken
          },
          "Patient logged in successfully"
          
        )
      )

    }      

      
  )

    

     const generateAccessAndRefreshTokens = async(patientId)=>{
      try {
        await Patient.findById(patientId)
        const accessToken = patient.generateAccessToken()
        const refreshToken = patient.generateRefreshTokens()

        patient.refreshToken = refreshToken
        patient.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
        
      } catch (error) {
        throw new ApiError(500,"Something went wrong while generating Access and Refresh token")
        
      }
     }

     const logoutPatient = asyncHandler(async (req,res)=>{
       await Patient.findByIdAndUpdate(
        req.patient._id,{
          $set: {
            refreshToken: undefined,
          }
          
        },
        {
           new: true,

        }
       )
       const options = {
        httpOnly: true,   //cookies are modiafiable at only server end if httponly:true and secure: true,
        secure: true
      }

      return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "Patient logged out"))
      
     })

     const refreshAccessToken = asyncHandler(async(req,res)=>{
      req.cookies.refreshToken
     })
export { registerPatient,
         loginPatient,
         logoutPatient
 }