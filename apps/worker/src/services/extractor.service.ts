import fs from "fs/promises";
import path from "path";

import pdf from "pdf-parse";
import mammoth from "mammoth";


export async function extractText(
    filePath: string,
    mimeType: string
): Promise<string> {


    const absolutePath =
        path.resolve(filePath);


    const buffer =
        await fs.readFile(
            absolutePath
        );


    switch (mimeType) {


        case "application/pdf": {

            const result =
                await pdf(buffer);


            return result.text.trim();
        }



        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {

            const result =
                await mammoth.extractRawText({
                    buffer
                });


            return result.value.trim();
        }



        case "text/plain": {

            return buffer
                .toString("utf-8")
                .trim();

        }



        default:

            throw new Error(
                `Unsupported extraction type: ${mimeType}`
            );
    }
}