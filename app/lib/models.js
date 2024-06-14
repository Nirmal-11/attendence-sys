import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    punchInTimes: [Date],
    punchOutTimes: [Date],
    isAdmin: {
        type: Boolean,
        default: false,
    },
  
}, { timestamps: true })


export default mongoose.models.User || mongoose.model("User", userSchema);