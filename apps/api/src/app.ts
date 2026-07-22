import express from "express";
// import cors from "cors";
import healthRoute from "./routes/health.route";
import documentRoute from "./routes/document.route";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

// app.use(cors());
app.use(express.json());

app.use("/health", healthRoute);
app.use("/documents", documentRoute);

app.use(errorMiddleware);

export default app;