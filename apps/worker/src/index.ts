import "dotenv/config";

import {
    startConsumer
} from "./queue/consumer";

console.log(
    "DATABASE:",
    process.env.DATABASE_URL
);

console.log(
    "Worker started"
);


startConsumer();