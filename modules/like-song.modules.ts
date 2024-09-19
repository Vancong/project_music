import mongoose from "mongoose";

const likeSongSchema = new mongoose.Schema(
    {
        like: Array,
        songId: String,
    },
    {
        timestamps: true,
    }
);

const likeSongDtb = mongoose.model("LikeSong", likeSongSchema, "like-songs");

export default likeSongDtb;
