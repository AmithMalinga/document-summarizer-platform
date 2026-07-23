import amqp from "amqplib";


const QUEUE =
    "document-processing";


let channel: amqp.Channel | null = null;



export async function connectQueue() {


    const connection =
        await amqp.connect(
            "amqp://guest:guest@localhost:5672"
        );


    channel =
        await connection.createChannel();


    await channel.assertQueue(
        QUEUE
    );


    console.log(
        "RabbitMQ Connected"
    );

}



export async function publishJob(
    payload: object
) {


    if (!channel) {

        throw new Error(
            "RabbitMQ channel not initialized"
        );

    }


    channel.sendToQueue(
        QUEUE,
        Buffer.from(
            JSON.stringify(payload)
        ),
        {
            persistent: true
        }
    );


    console.log(
        "Job published:",
        payload
    );

}