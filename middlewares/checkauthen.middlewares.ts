import { Request, Response, NextFunction } from "express";
import userDtb from "../modules/user.modules";
export const Auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/user/login");
        return;
    }
    const user = await userDtb.findOne({
        token: token,
    });
    if (!user) {
        res.redirect("/user/login");
        return;
    }
    res.locals.user = user;
    res.locals.id = user.id;
    next();
};

export const checkFavourite = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.cookies.token) {
        const user = await userDtb.findOne({
            token: req.cookies.token,
        });
        if (user) {
            res.locals.user = user;
        }
    }
    next();
};
