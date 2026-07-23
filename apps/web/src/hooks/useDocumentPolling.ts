"use client";

import {
    useEffect,
    useState
} from "react";

import {
    getDocument
} from "@/lib/api";


export function useDocumentPolling(
    documentId: string
) {


    const [document, setDocument] =
        useState<any>(null);


    const [loading, setLoading] =
        useState(true);



    useEffect(() => {


        if (!documentId)
            return;



        let interval: any;



        async function fetchDocument() {


            try {


                const data =
                    await getDocument(
                        documentId
                    );


                setDocument(data);



                if (
                    data.status === "COMPLETED"
                    ||
                    data.status === "FAILED"
                ) {

                    clearInterval(
                        interval
                    );

                }



            }
            catch (error) {

                console.error(
                    error
                );

            }
            finally {

                setLoading(false);

            }

        }



        // first request immediately

        fetchDocument();



        // poll every 3 seconds

        interval =
            setInterval(
                fetchDocument,
                3000
            );



        return () => {

            clearInterval(
                interval
            );

        };


    }, [documentId]);



    return {
        document,
        loading
    };

}