import multer from "multer";


const storage = multer.memoryStorage();


const allowedMimeTypes = [

    "application/pdf",

    "text/plain",

    "image/jpeg",
    "image/png",
    "image/webp"

];


export const upload = multer({

    storage,

    limits: {

        fileSize: 10 * 1024 * 1024, // 10MB

        files: 10

    },


    fileFilter: (_req, file, cb) => {


        if (
            allowedMimeTypes.includes(file.mimetype)
        ) {

            cb(null, true);

        }
        else {

            cb(
                new Error(
                    `Unsupported file type: ${file.mimetype}`
                )
            );

        }

    }

});