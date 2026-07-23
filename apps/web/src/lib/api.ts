const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000";


export async function uploadDocuments(
    files: File[]
) {

    const formData =
        new FormData();


    files.forEach(file => {

        formData.append(
            "files",
            file
        );

    });



    const response =
        await fetch(
            `${API_URL}/documents/upload`,
            {
                method: "POST",
                body: formData
            }
        );


    if (!response.ok) {

        throw new Error(
            "Upload failed"
        );

    }


    return response.json();

}



export async function getDocument(
    id: string
) {

    const response =
        await fetch(
            `${API_URL}/documents/${id}`,
            {
                cache: "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            "Failed loading document"
        );

    }


    return response.json();

}