import prisma from "../database/client";

import {
    extractText
} from "./extractor.service";


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



    if (
        job.status === "COMPLETED"
    ) {

        console.log(
            "Duplicate job ignored:",
            jobId
        );

        return;

    }



    await prisma.job.update({

        where: {
            id: jobId
        },

        data: {

            status:
                "PROCESSING"

        }

    });



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



    const extractedText =
        await extractText(
            document.storageKey,
            document.mimeType
        );



    console.log(
        "Extracted characters:",
        extractedText.length
    );



    const summary =
        extractedText.length > 300
            ? extractedText.substring(0, 300)
            : extractedText;



    await prisma.summary.create({

        data: {

            documentId,

            content:
                summary ||
                "No text extracted"

        }

    });



    await prisma.classification.create({

        data: {

            documentId,

            category:
                "technical",

            confidence:
                0.95

        }

    });



    await prisma.document.update({

        where: {
            id: documentId
        },

        data: {

            status:
                "COMPLETED"

        }

    });



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