import {
    Router
} from "express";


import {
    upload
} from "../middleware/upload.middleware";


import {
    uploadDocuments
} from "../controllers/document.controller";


const router =
    Router();


router.post(
    "/upload",
    upload.array("files"),
    uploadDocuments
);


export default router;