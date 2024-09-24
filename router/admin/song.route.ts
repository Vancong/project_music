import * as songControllers from "../../controllers/admin/song.controllers";
import express from "express";
import multer from "multer";
import * as uploadCoud from "../../middlewares/admin/uploadCloud.middleware";
const upload = multer();

const router = express.Router();

router.get("/", songControllers.index);

router.get("/create", songControllers.create);

router.post(
    "/create",
    upload.single("avatar"),
    uploadCoud.uploadSingle,
    songControllers.createPost
);

export const routerSong = router;
