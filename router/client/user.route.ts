import * as userControllers from "../../controllers/client/user.controllers";
import express from "express";

const router = express.Router();

router.get("/register", userControllers.register);

router.post("/register", userControllers.registerPost);

router.get("/login", userControllers.login);

router.patch("/login", userControllers.loginPatch);

router.get("/logout", userControllers.logout);

export const routeUser = router;
