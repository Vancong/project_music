import * as songsControllers from "../../controllers/client/songs.controllers";
import express from "express";
import * as checkMiddl from "../../middlewares/checkauthen.middlewares";
const router = express.Router();

router.patch("/listen", songsControllers.listen);

router.get("/search/:type", songsControllers.search);

router.get("/:slugTopic", songsControllers.index);

router.get("/detail/:slugSong", songsControllers.detail);

router.patch("/like", checkMiddl.Auth, songsControllers.like);

export const routerSongs = router;
