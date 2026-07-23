import fs from "fs/promises";

import {
    PDFParse
} from "pdf-parse";



export async function extractText(
    filePath: string,
    mimeType: string
): Promise<string> {


    switch (mimeType) {


        case "application/pdf":

            return extractPdf(
                filePath
            );



        case "text/plain":

            return extractTxt(
                filePath
            );



        default:

            throw new Error(
                `Unsupported extraction type: ${mimeType}`
            );

    }

}



async function extractPdf(
    filePath: string
): Promise<string> {


    const buffer =
        await fs.readFile(
            filePath
        );


    const parser =
        new PDFParse({

            data: buffer

        });



    const result =
        await parser.getText();



    await parser.destroy();



    return (
        result.text ??
        ""
    ).trim();

}




async function extractTxt(
    filePath: string
): Promise<string> {


    const content =
        await fs.readFile(
            filePath,
            "utf-8"
        );


    return content.trim();

}