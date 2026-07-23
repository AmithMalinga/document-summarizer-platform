export async function pollDocument(
    documentId: string,
    callback: (
        data: any
    ) => void
) {

    const interval =
        setInterval(async () => {

            const response =
                await fetch(
                    `http://localhost:4000/documents/${documentId}`
                );

            const data =
                await response.json();

            callback(data);

            if (
                data.status === "COMPLETED"
            ) {

                clearInterval(
                    interval
                );

            }

        }, 2000);

    return interval;
}