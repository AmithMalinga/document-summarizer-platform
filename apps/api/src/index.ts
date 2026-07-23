import app from "./app";

import {
    connectQueue
} from "../../worker/src/services/queue.service";


async function startServer() {

    try {

        await connectQueue();


        app.listen(
            4000,
            () => {

                console.log(
                    "API server running on port 4000"
                );

            }
        );


    } catch (error) {

        console.error(
            "Startup failed:",
            error
        );

        process.exit(1);

    }

}


startServer();