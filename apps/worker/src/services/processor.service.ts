import prisma from "../database/client";

import {
    extractText
} from "./extractor.service";

import {
    generateSummary
} from "./ai.service";


export async function processDocument(
    documentId: string,
    jobId: string
) {

    console.log(
        "PROCESS DOCUMENT FUNCTION CALLED",
        {
            documentId,
            jobId
        }
    );


    const job =
        await prisma.job.findUnique({

            where: {
                id: jobId
            }

        });



    if (!job) {

        console.log(
            "Job not found:",
            jobId
        );

        return;

    }



    // Idempotency protection
    if (
        job.status === "COMPLETED"
    ) {

        console.log(
            "Duplicate job ignored:",
            jobId
        );

        return;

    }



    try {


        // Mark job processing

        await prisma.job.update({

            where: {
                id: jobId
            },

            data: {

                status:
                    "PROCESSING"

            }

        });



        // Mark document processing

        await prisma.document.update({

            where: {
                id: documentId
            },

            data: {

                status:
                    "PROCESSING"

            }

        });



        const document =
            await prisma.document.findUnique({

                where: {
                    id: documentId
                }

            });



        if (!document) {

            throw new Error(
                "Document not found"
            );

        }



        console.log(
            "Processing document:",
            document.originalName
        );



        /*
            STEP 1:
            Extract document text
        */

        const extractedText =
            await extractText(

                document.storageKey,

                document.mimeType

            );



        console.log(
            "Extracted characters:",
            extractedText.length
        );



        if (!extractedText.trim()) {

            throw new Error(
                "No text extracted from document"
            );

        }



        /*
            STEP 2:
            AI summarization + classification
        */

        const result =
            await generateSummary(
                extractedText
            );



        console.log(
            "AI Result:",
            result
        );



        /*
            STEP 3:
            Save summary
        */

        await prisma.summary.create({

            data: {

                documentId,

                content:
                    result.summary

            }

        });



        /*
            STEP 4:
            Save classification
        */

        await prisma.classification.create({

            data: {

                documentId,

                category:
                    result.category,

                confidence:
                    result.confidence

            }

        });



        /*
            STEP 5:
            Complete document
        */

        await prisma.document.update({

            where: {
                id: documentId
            },

            data: {

                status:
                    "COMPLETED"

            }

        });



        /*
            STEP 6:
            Complete job
        */

        await prisma.job.update({

            where: {
                id: jobId
            },

            data: {

                status:
                    "COMPLETED",

                completedAt:
                    new Date()

            }

        });



        console.log(
            "Completed:",
            documentId
        );


    }
    catch (error) {


        console.error(
            "Processing failed:",
            error
        );



        await prisma.job.update({

            where: {
                id: jobId
            },

            data: {

                status:
                    "FAILED"

            }

        });



        await prisma.document.update({

            where: {
                id: documentId
            },

            data: {

                status:
                    "FAILED"

            }

        });



        throw error;

    }

}