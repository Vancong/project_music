import * as songsControllers from "../../controllers/client/songs.controllers";
import express from "express";
import * as checkMiddl from "../../middlewares/checkauthen.middlewares";
const router = express.Router();

router.get("/:slugTopic", songsControllers.index);

router.get(
    "/detail/:slugSong",
    checkMiddl.checkFavourite,
    songsControllers.detail
);

router.patch("/like", checkMiddl.checkFavourite, songsControllers.like);

router.patch("/favourite", checkMiddl.Auth, songsControllers.favourite);

export const routerSongs = router;
