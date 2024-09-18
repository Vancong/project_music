import { Request, Response } from "express";
import userDtb from "../../modules/user.modules";
import md5 from "md5";
import { generateRandomString } from "../../helpers/generate.helpers";
//[GET] /user/register
export const register = async (req: Request, res: Response) => {
    res.render("client/page/user/register.pug", {
        pageTitle: "Register",
    });
};

//[POST] /user/register
export const registerPost = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const existEmail = await userDtb.findOne({
        email: email,
    });
    if (existEmail) {
        // req.falsh("error","Email da ton tai");
        res.redirect("back");
        return;
    }
    req.body.password = md5(req.body.password);
    const token: string = generateRandomString(30);
    req.body.token = token;
    const user = new userDtb(req.body);
    await user.save();
    res.cookie("token", token);
    res.redirect("/topics");
};

//[GET] /user/login
export const login = async (req: Request, res: Response) => {
    res.render("client/page/user/login.pug", {
        pageTitle: "Login",
    });
};

//[PATCH] /user/login
export const loginPatch = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = md5(req.body.password);
    const existEmail = await userDtb.findOne({
        email: email,
    });
    if (!existEmail || password != existEmail.password) {
        res.redirect("back");
        // req.falsh("error","Sai email hoac mat khau")
        return;
    }
    res.cookie("token", existEmail.token);
    // req.falsh("suceese","Dang nhap thanh cong");
    res.redirect("/topics");
};

//[GET] /user/logout
export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.redirect("/user/login");
};
