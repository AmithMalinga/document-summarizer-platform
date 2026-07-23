import {
    prisma
} from "@document/database";


export async function getDocumentById(
    id: string
) {

    const document =
        await prisma.document.findUnique({

            where: {
                id
            },

            include: {

                summary: true,

                classification: true

            }

        });



    if (!document) {

        throw new Error(
            "Document not found"
        );

    }



    return document;

}