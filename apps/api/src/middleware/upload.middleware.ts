import multer from "multer";


const storage =
    multer.memoryStorage();



const allowedMimeTypes = [

    "application/pdf",

    "text/plain",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "image/jpeg",

    "image/png",

    "image/webp"

];



export const upload = multer({

    storage,


    limits: {

        fileSize:
            10 * 1024 * 1024,

        files:
            10

    },


    fileFilter: (

        _req,

        file,

        callback

    ) => {


        if (
            allowedMimeTypes.includes(
                file.mimetype
            )
        ) {


            callback(
                null,
                true
            );


            return;

        }



        callback(

            new Error(
                `Unsupported file type: ${file.mimetype}`
            )

        );

    }

});