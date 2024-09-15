import * as songsControllers from "../../controllers/client/songs.controllers";
import express from "express";

const router = express.Router();

router.get("/:slugTopic", songsControllers.index);

router.get("/detail/:slugSong", songsControllers.detail);

export const routerSongs = router;
