import { Router } from "express";
import {
    uploadDocuments,
    getDocument,
    getDocuments,
} from "../controllers/document.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// Upload single or multiple documents
router.post(
    "/upload",
    (req, res, next) => {
        upload.array("files")(req, res, (err) => {
            if (err) {
                return next(err);
            }
            next();
        });
    },
    uploadDocuments
);

// Fetch all documents
router.get("/", getDocuments);

// Fetch a single document by ID
router.get("/:id", getDocument);

export default router;