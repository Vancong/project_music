import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
    {
        fullName: String,
        avatar: String,
        status: String,
        slug: String,
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const singerDtb = mongoose.model("singers", songSchema, "singers");

export default singerDtb;
