import {
    prisma
} from "@document/database";

import {
    saveFile
} from "./storage.service";


export async function createDocument(
    file: Express.Multer.File
) {

    const storagePath =
        await saveFile(file);


    const document =
        await prisma.document.create({

            data: {

                filename:
                    storagePath.split("\\").pop()
                    ?? file.originalname,

                originalName:
                    file.originalname,

                mimeType:
                    file.mimetype,

                size:
                    file.size,

                storageKey:
                    storagePath

            }

        });


    const job =
        await prisma.job.create({

            data: {
                documentId:
                    document.id
            }

        });


    return {
        document,
        job
    };

}