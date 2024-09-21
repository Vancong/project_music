import { Request, Response } from "express";
import songDtb from "../../modules/songs.modules";
import singerDtb from "../../modules/singer.modules";
import topicDtb from "../../modules/topics.model";
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
