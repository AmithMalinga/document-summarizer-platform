"use client";


import {
    useParams
} from "next/navigation";


import {
    useDocumentPolling
} from "@/hooks/useDocumentPolling";



export default function DocumentPage() {


    const params =
        useParams();


    const id =
        params.id as string;



    const {
        document,
        loading

    } =
        useDocumentPolling(
            id
        );



    if (loading) {

        return (

            <div className="p-8">

                Loading document...

            </div>

        );

    }



    if (!document) {

        return (

            <div className="p-8">

                Document not found

            </div>

        );

    }



    return (

        <main className="p-8 space-y-6">


            <h1 className="text-2xl font-bold">

                {document.originalName}

            </h1>



            <div>

                Status:

                <span className="ml-2 font-semibold">

                    {document.status}

                </span>


            </div>



            {
                document.status === "PROCESSING"
                &&
                <p>

                    Your document is being processed...

                </p>

            }



            {
                document.status === "COMPLETED"
                &&
                <>

                    <section>

                        <h2 className="font-bold">

                            Summary

                        </h2>


                        <p>

                            {
                                document.summary?.content
                            }

                        </p>


                    </section>



                    <section>

                        <h2 className="font-bold">

                            Classification

                        </h2>


                        <p>

                            {
                                document.classification?.category
                            }

                        </p>


                        <p>

                            Confidence:

                            {
                                document.classification?.confidence
                            }

                        </p>


                    </section>

                </>

            }



        </main>

    );

}