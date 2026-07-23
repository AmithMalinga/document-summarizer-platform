import prisma from "../database/client";


export async function processDocument(
    documentId: string,
    jobId: string
) {

    const existingJob =
        await prisma.job.findUnique({
            where: {
                id: jobId
            }
        });


    if (!existingJob) {
        console.log(
            "Job not found:",
            jobId
        );
        return;
    }


    // Idempotency protection
    if (
        existingJob.status === "COMPLETED"
    ) {

        console.log(
            "Duplicate job ignored:",
            jobId
        );

        return;
    }



    // Mark processing
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



    // Mock AI processing delay
    await new Promise(
        resolve =>
            setTimeout(resolve, 5000)
    );



    /*
        Future replacement:

        1. Extract text
        2. Send extracted text to LLM
        3. Classify document
        4. Save confidence

    */



    const result = {

        summary:
            "Generated document summary",

        category:
            "technical",

        confidence:
            0.95

    };




    // Save summary
    await prisma.summary.create({

        data: {

            documentId,

            content:
                result.summary

        }

    });



    // Save classification
    await prisma.classification.create({

        data: {

            documentId,

            category:
                result.category,

            confidence:
                result.confidence

        }

    });




    // Complete document
    await prisma.document.update({

        where: {
            id: documentId
        },

        data: {

            status:
                "COMPLETED"

        }

    });




    // Complete job
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