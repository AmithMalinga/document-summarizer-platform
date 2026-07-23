import prisma from "../database/client";


export async function processDocument(
    documentId: string,
    jobId: string
) {


    await prisma.job.update({

        where: {
            id: jobId
        },

        data: {
            status: "PROCESSING"
        }

    });


    await prisma.document.update({

        where: {
            id: documentId
        },

        data: {
            status: "PROCESSING"
        }

    });



    console.log(
        "Processing:",
        documentId
    );



    await new Promise(
        resolve =>
            setTimeout(resolve, 5000)
    );



    const result = {

        summary:
            "Generated document summary",

        category:
            "technical",

        confidence:
            0.95

    };



    await prisma.document.update({

        where: {
            id: documentId
        },

        data: {
            status: "COMPLETED"
        }

    });


    await prisma.summary.create({

        data: {

            documentId,

            content:
                result.summary

        }

    });


    await prisma.classification.create({

        data: {

            documentId,

            category:
                result.category,

            confidence:
                result.confidence

        }

    });

    await prisma.job.update({

        where: {
            id: jobId
        },

        data: {

            status: "COMPLETED",

            completedAt:
                new Date()

        }

    });



    console.log(
        "Completed:",
        documentId
    );


}