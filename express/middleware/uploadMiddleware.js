import { v4 as uuidv4 } from "uuid";

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("file was", file);
        cb(null, path.join(__dirname, "../uploads/"));
    },
    filename: (req, file, cb) => {
        const id = uuidv4();
        let ext = path.extname(file.originalname);

        cb(null, `${id}${ext}`);
    },
});
export const upload = multer({
    limits: 800000,
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedFileType = ["jpg", "jpeg", "png"];
        if (allowedFileType.includes(file.mimetype.split("/")[1])) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
});
