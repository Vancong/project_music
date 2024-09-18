import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        avatar: String,
        token: String,
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);
const userDtb = mongoose.model("User", userSchema, "user");
export default userDtb;
