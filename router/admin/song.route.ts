import * as songControllers from "../../controllers/admin/song.controllers";
import express from "express";

const router = express.Router();

router.get("/", songControllers.index);

export const routerSong = router;
