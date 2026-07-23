import "dotenv/config";

import {
    startConsumer
} from "./queue/consumer";

console.log(
    "Worker started"
);


startConsumer();