import {
    Request,
    Response
} from "express";


import {
    createDocument
} from "../services/document.service";


export async function uploadDocuments(
    req: Request,
    res: Response
) {

    try {

        const files =
            req.files as Express.Multer.File[];


        if (!files || files.length === 0) {

            return res.status(400)
                .json({
                    message: "No files uploaded"
                });

        }


        const results = [];


        for (const file of files) {

            const result =
                await createDocument(file);

            results.push({

                documentId:
                    result.document.id,

                jobId:
                    result.job.id,

                status:
                    result.document.status

            });

        }


        return res.status(201)
            .json(results);


    }
    catch (error) {

        console.error(error);

        return res.status(500)
            .json({
                message: "Upload failed"
            });

    }

}