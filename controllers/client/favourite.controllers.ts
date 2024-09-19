import { Request, Response } from "express";
import songDtb from "../../modules/songs.modules";
import topicDtb from "../../modules/topics.model";
import singerDtb from "../../modules/singer.modules";
import favoriteSongDtb from "../../modules/favorite-song.moudels";
// [GET] /songs/favourite
export const listFavourite = async (req: Request, res: Response) => {
    const user = res.locals.user;
    const favorite = await favoriteSongDtb.find({
        userId: user.id,
    });

    for (const element of favorite) {
        const song = await songDtb.findOne({
            _id: element.songId,
        });

        const singer = await singerDtb.findOne({
            _id: song.singerId,
        });

        const topic = await topicDtb.findOne({
            _id: song.topicId,
        });
        element["songId"] = song["id"];
        element["singerFullName"] = singer["fullName"];
        element["like"] = song["like"];
        element["avatar"] = song["avatar"];
        element["title"] = song["title"];
        element["slug"] = song["slug"];
    }

    res.render("client/page/songs/favourite.pug", {
        pageTitle: "Danh sach bai hay yeu thich",
        songs: favorite,
    });
};

// [PATCH] /songs/favourite
export const favourite = async (req: Request, res: Response) => {
    if (res.locals.user) {
        const id: string = req.body.id;
        const user = res.locals.user;
        const checkFavourite = await favoriteSongDtb.findOne({
            songId: id,
            userId: user.id,
        });
        const data = {
            songId: id,
            userId: user.id,
        };
        let status = "distym";
        if (!checkFavourite) {
            status = "tym";
            const favorite = new favoriteSongDtb(data);
            await favorite.save();
        } else {
            await favoriteSongDtb.deleteOne({
                songId: id,
                userId: user.id,
            });
        }
        res.json({
            code: 200,
            status: status,
        });
    }
};
