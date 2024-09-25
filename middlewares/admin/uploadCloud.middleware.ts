import { NextFunction, Request, Response } from "express";
import { streamUpload } from "../../helpers/streamUpload.helper";
export const uploadSingle = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req["file"]) {
        const uploadToCloudinary = async (buffer) => {
            const result = await streamUpload(buffer);
            req.body[req["file"].fieldname] = result["url"];
            next();
        };
        uploadToCloudinary(req["file"].buffer);
    } else {
        next();
    }
};

export const uploadFields = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    for (const key in req["files"]) {
        req.body[key] = [];
        const array = req["files"][key];
        for (const element of array) {
            const result = await streamUpload(element.buffer);
            req.body[key].push(result["url"]);
        }
    }

    next();
};
