import mongoose from "mongoose"

const doctorSchema = new mongoose.schema({

        name:{
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        qualifications: {
            type: String,
            required: true,
        },
        exprerience: {
            type: Number,
            default: 0,
        },
        workInHospitals: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Hospital",
            }
        ],

    },{timestamps: true}

);

export const Doctor = mongoose.model("Doctor",doctorSchema)