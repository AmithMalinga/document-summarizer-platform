import fs from "fs/promises";

import { PDFParse } from "pdf-parse";

import {
    createWorker
} from "tesseract.js";



export async function extractText(
    filePath: string,
    mimeType: string
): Promise<string> {


    switch (mimeType) {


        case "application/pdf":

            return await extractPdf(
                filePath
            );



        case "text/plain":

            return await extractTxt(
                filePath
            );



        case "image/png":
        case "image/jpeg":
        case "image/webp":

            return await extractImage(
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


    return result.text.trim();

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





async function extractImage(
    filePath: string
): Promise<string> {


    console.log(
        "Running OCR:",
        filePath
    );


    const worker =
        await createWorker(
            "eng"
        );


    const result =
        await worker.recognize(
            filePath
        );


    await worker.terminate();


    return result.data.text.trim();

}