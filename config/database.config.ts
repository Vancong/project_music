// import mongoose from "mongoose";
// export const conect = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URL);
//         console.log("ket noi database thanh cong");
//     } catch (error) {
//         console.log("ket noi database that bai");
//     }
// };

import mongoose from "mongoose";
export const connectDtb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("ket noi database thanh cong");
    } catch (error) {
        console.log("ket noi dtb that bai");
    }
};
