import {
    Request,
    Response
} from "express";

import {
    getDocumentById
} from "../services/document-query.service";

import {
    createDocument
} from "../services/document.service";

import {
    publishJob
} from "../../../worker/src/services/queue.service";

export async function uploadDocuments(
    req: Request,
    res: Response
) {

    try {

        const files =
            req.files as Express.Multer.File[];


        /**
         * No files uploaded
         */
        if (!files || files.length === 0) {

            return res.status(400).json({

                message: "No files uploaded"

            });

        }


        /**
         * Multer already validates:
         * - file type
         * - file size
         * - file count
         *
         * At this point,
         * only valid files reach here.
         */


        const results = await Promise.all(

            files.map(async (file) => {


                const result =
                    await createDocument(file);

                await publishJob({

                    documentId:
                        result.document.id,

                    jobId:
                        result.job.id

                });


                return {

                    documentId:
                        result.document.id,


                    jobId:
                        result.job.id,


                    status:
                        result.document.status

                };

            })

        );


        return res.status(201).json(results);


    } catch (error) {


        console.error(
            "Upload error:",
            error
        );


        return res.status(500).json({

            message: "Upload failed"

        });

    }

}

export async function getDocument(
    req: Request,
    res: Response
) {

    try {

        const {
            id
        } = req.params;



        const document =
            await getDocumentById(id);



        return res.json(
            document
        );


    }
    catch (error) {

        console.error(error);


        return res.status(404)
            .json({

                message:
                    "Document not found"

            });

    }

}