import { Document } from "../types/document";


const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000";



/**
 * Upload one or multiple documents.
 *
 * Sends files as multipart/form-data.
 */
export async function uploadDocuments(
    files: File[]
) {

    const formData =
        new FormData();



    files.forEach(
        (file) => {

            formData.append(
                "files",
                file
            );

        }
    );



    const response =
        await fetch(
            `${API_URL}/documents/upload`,
            {
                method: "POST",

                body: formData,
            }
        );



    if (!response.ok) {


        const error =
            await response
                .json()
                .catch(
                    () => ({
                        message:
                            "Upload failed"
                    })
                );



        throw new Error(
            error.message ||
            "Upload failed"
        );

    }



    return response.json();

}





/**
 * Fetch all uploaded documents.
 */
export async function getDocuments()
    : Promise<Document[]> {


    const response =
        await fetch(
            `${API_URL}/documents`,
            {
                cache: "no-store",
            }
        );



    if (!response.ok) {

        throw new Error(
            "Failed to fetch documents"
        );

    }



    return response.json();

}





/**
 * Fetch a single document by ID.
 */
export async function getDocument(
    id: string
)
    : Promise<Document> {


    const response =
        await fetch(
            `${API_URL}/documents/${id}`,
            {
                cache: "no-store",
            }
        );



    if (!response.ok) {

        throw new Error(
            "Failed to fetch document"
        );

    }



    return response.json();

}