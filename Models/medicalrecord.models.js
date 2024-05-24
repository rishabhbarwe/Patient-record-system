import mongoose from "mongoose"

const medicalRecordSchema = new mongoose.schema({


},{timestamps: true})

export const MedicalRecord = mongoose.model("MedicalRecord",medicalRecordSchema)