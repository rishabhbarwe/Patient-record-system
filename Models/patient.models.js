import mongoose from "mongoose"

const patientdSchema = new mongoose.schema({
      
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

export const Patient = mongoose.model("Patient",patientdSchema)