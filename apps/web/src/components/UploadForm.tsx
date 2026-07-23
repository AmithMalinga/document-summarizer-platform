"use client";


import {
    useState
} from "react";


import {
    uploadDocuments
} from "@/lib/api";


export default function UploadForm() {


    const [files, setFiles] =
        useState<File[]>([]);


    const [loading, setLoading] =
        useState(false);


    const [result, setResult] =
        useState<any[]>([]);



    async function upload() {


        try {


            setLoading(true);


            const data =
                await uploadDocuments(
                    files
                );


            setResult(data);


        }
        catch (error) {

            console.error(error);

        }
        finally {

            setLoading(false);

        }


    }



    return (

        <div>


            <h2>
                Upload Documents
            </h2>


            <input

                type="file"

                multiple

                onChange={
                    e =>
                        setFiles(
                            Array.from(
                                e.target.files || []
                            )
                        )
                }

            />


            <button

                disabled={
                    loading ||
                    files.length === 0
                }

                onClick={upload}

            >

                {
                    loading
                        ?
                        "Uploading..."
                        :
                        "Upload"
                }

            </button>



            {
                result.map(
                    item => (

                        <div key={item.documentId}>

                            <p>
                                Document:
                                {item.documentId}
                            </p>

                            <p>
                                Status:
                                {item.status}
                            </p>

                        </div>

                    )

                )
            }


        </div>


    );


}