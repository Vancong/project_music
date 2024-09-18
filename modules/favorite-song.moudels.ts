import mongoose from "mongoose";

const favoriteSongSchema = new mongoose.Schema(
    {
        userId: String,
        songId: String,
    },
    {
        timestamps: true,
    }
);

const favoriteSongDtb = mongoose.model(
    "FavoriteSong",
    favoriteSongSchema,
    "favorite-songs"
);

export default favoriteSongDtb;
