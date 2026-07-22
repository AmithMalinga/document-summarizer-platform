import fs from "fs/promises";
import path from "path";


const UPLOAD_DIR = path.join(
    process.cwd(),
    "uploads"
);


export async function saveFile(
    file: Express.Multer.File
) {

    await fs.mkdir(
        UPLOAD_DIR,
        {
            recursive: true
        }
    );


    const filePath = path.join(
        UPLOAD_DIR,
        `${Date.now()}-${file.originalname}`
    );


    await fs.writeFile(
        filePath,
        file.buffer
    );


    return filePath;
}