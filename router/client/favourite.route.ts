import * as favouriteControllers from "../../controllers/client/favourite.controllers";
import express from "express";
import * as checkMiddl from "../../middlewares/checkauthen.middlewares";
const router = express.Router();

router.get("/", checkMiddl.Auth, favouriteControllers.listFavourite);

router.patch("/", favouriteControllers.favourite);

export const routerFavourite = router;
