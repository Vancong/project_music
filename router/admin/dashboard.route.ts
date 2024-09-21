import * as dashboardControllers from "../../controllers/admin/dashboard.controllers";
import express from "express";

const router = express.Router();

router.get("/", dashboardControllers.index);

export const routerDashboard = router;
