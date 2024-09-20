import { Request, Response } from "express";
import songDtb from "../../modules/songs.modules";
import topicDtb from "../../modules/topics.model";
import singerDtb from "../../modules/singer.modules";
import favoriteSongDtb from "../../modules/favorite-song.moudels";
import likeSongDtb from "../../modules/like-song.modules";
import unidecode from "unidecode";
// [GET] /songs/search
export const search = async (req: Request, res: Response) => {
    const type = req.params.type;
    const keyword = `${req.query.keyword}`.trim();
    console.log(keyword);
    // tìm theo tên ca sĩ
    let singer = keyword;
    singer = unidecode(singer);
    let regexSinger = new RegExp(singer, "i");
    let singerSlug = singer.replace(/\s/g, "-");
    singerSlug = singerSlug.replace(/-+/g, "-");
    let regexSingerSlug = new RegExp(singerSlug, "i"); //"i " k phan biet chu hoa hay chu thuong
    let dataSinger = await singerDtb.find({
        $or: [
            {
                fullName: regexSinger,
            },
            {
                slug: regexSingerSlug,
            },
        ],
        deleted: false,
        status: "active",
    });
    const IdSinger = dataSinger.map((item) => item.id); // lay ra mang id singer co ten nhu the

    // tìm theo tên bài hát
    const regexTitle = new RegExp(keyword, "i");
    let keywordSlug = keyword;
    keywordSlug = unidecode(keyword); // bỏ dấu
    keywordSlug = keywordSlug.replace(/\s/g, "-"); // \s ki tu khoang cach  thay the "-"
    keywordSlug = keywordSlug.replace(/-+/g, "-"); // tim tat ca dau tru và thay thế

    const regexSlug = new RegExp(`${keywordSlug}`, "i");
    const songs = await songDtb
        .find({
            $or: [
                {
                    title: regexTitle,
                },
                {
                    slug: regexSlug,
                },
                {
                    singerId: { $in: IdSinger },
                },
            ],
            deleted: false,
            status: "active",
        })
        .select("title avatar singerId like slug");
    for (const item of songs) {
        const singerInfo = await singerDtb
            .findOne({
                _id: item.singerId,
            })
            .select("fullName");
        item["singerFullName"] = singerInfo["fullName"];
    }
    if (type == "result") {
        res.render("client/page/songs/list.pug", {
            pageTitle: `Kết quả tìm kiếm : ${keyword}`,
            keyword: keyword,
            songs: songs,
        });
    } else if (type == "suggest") {
        res.json({
            code: 200,
            songs: songs,
        });
    } else {
        res.json({
            code: 400,
        });
    }
};
