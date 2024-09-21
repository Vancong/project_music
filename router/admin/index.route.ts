import { Express } from "express";
import { systemConfig } from "../../config/system.config";
import { routerDashboard } from "./dashboard.route";
export const routeAdmin = (app: Express) => {
    const prefixAdmin = systemConfig.prefixAdmin;
    app.use(`/${prefixAdmin}/dashboard`, routerDashboard);
};
