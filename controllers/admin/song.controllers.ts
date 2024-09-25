import { Request, Response } from "express";
import songDtb from "../../modules/songs.modules";
import singerDtb from "../../modules/singer.modules";
import topicDtb from "../../modules/topics.model";
import { systemConfig } from "../../config/system.config";
//[GET] /admin/songs
export const index = async (req: Request, res: Response) => {
    const songs = await songDtb.find({
        deleted: false,
        status: "active",
    });

    for (const element of songs) {
        const singer = await singerDtb.findOne({
            _id: element.singerId,
        });
        const topic = await topicDtb.findOne({
            _id: element.topicId,
        });
        element["singerFullName"] = singer["fullName"];
        element["topic"] = topic["title"];
    }

    res.render("admin/page/song/index.pug", {
        pageTitle: "Quản lý bài hát",
        songs: songs,
    });
};

//[GET] /admin/crate
export const create = async (req: Request, res: Response) => {
    const topics = await topicDtb
        .find({
            deleted: false,
            status: "active",
        })
        .select("title");
    const singers = await singerDtb
        .find({
            deleted: false,
            status: "active",
        })
        .select("fullName");

    res.render("admin/page/song/create.pug", {
        pageTitle: "Thêm mới bài hát",
        topics: topics,
        singers: singers,
    });
};

//[POST] /admin/cratePost
export const createPost = async (req: Request, res: Response) => {
    if (req.body.avatar) {
        req.body.avatar = req.body.avatar[0];
    }
    if (req.body.audio) {
        req.body.audio = req.body.audio[0];
    }

    const song = new songDtb(req.body);
    await song.save();
    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
};
