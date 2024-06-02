import mongoose from "mongoose"
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"

const patientSchema = new mongoose.Schema({
      
    name:{
        type: String,
        required: true,
    },
    diagonsedWith: {  
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    },
    bloodGroup: {
        type: String,
        required: true,
    },
    gender:{
        type: String,
        enum: ["M", "F", "Others"],
        required: true,
    },
    admittedIn:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    }


},{timestamps: true})

patientSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

patientSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

patientSchema.methods.generateAccessToken = function(){
     return JsonWebTokenError.sign(
        
        {
          _id: this._id,
          age: this.age,
          name: this.name,
          diagonsedWith: this.diagonsedWith,
         },
         process.env.ACCESS_TOKEN_SECRET,
         {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
         }
    )
    
}
patientSchema.methods.generateRefreshToken = function(){
    return  JsonWebTokenError.sign(
        
        {
          _id: this._id,
          age: this.age,
          name: this.name,
          diagonsedWith: this.diagonsedWith,
         },
         process.env.REFRESH_TOKEN_SECRET,
         {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
         }
    )
    
}


export const Patient = mongoose.model("Patient",patientSchema)