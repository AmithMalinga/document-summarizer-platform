import amqp from "amqplib";

import {
    processDocument
} from "../services/processor.service";


const QUEUE =
    "document-processing";



export async function startConsumer() {


    const connection =
        await amqp.connect(
            "amqp://guest:guest@localhost:5672"
        );



    const channel =
        await connection.createChannel();



    await channel.assertQueue(
        QUEUE
    );



    console.log(
        "Worker connected to queue"
    );



    channel.consume(

        QUEUE,

        async message => {


            if (!message)
                return;



            try {


                const payload =
                    JSON.parse(
                        message.content.toString()
                    );



                console.log(
                    "Received job:",
                    payload
                );



                await processDocument(

                    payload.documentId,

                    payload.jobId

                );



                channel.ack(
                    message
                );


            }
            catch (error) {


                console.error(
                    "Processing failed:",
                    error
                );


                channel.nack(
                    message,
                    false,
                    false
                );

            }

        }

    );

}