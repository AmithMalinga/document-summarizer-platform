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


            const data =
                JSON.parse(
                    message.content.toString()
                );


            console.log(
                "Received job:",
                data
            );


            await processDocument(
                data.documentId,
                data.jobId
            );


            channel.ack(
                message
            );


        }
    );

}