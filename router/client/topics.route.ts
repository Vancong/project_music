import * as topicsControllers from "../../controllers/client/topics.controlles";
import express from "express";

const router = express.Router();

router.get("/", topicsControllers.index);

export const routerTopics = router;
