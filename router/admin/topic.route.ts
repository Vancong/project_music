import * as topicControllers from "../../controllers/admin/topic.controllers";
import express from "express";

const router = express.Router();

router.get("/", topicControllers.index);

export const routerTopic = router;
