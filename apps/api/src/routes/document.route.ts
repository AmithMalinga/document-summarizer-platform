import { Router } from "express";

import {
    uploadDocuments,
    getDocument
} from "../controllers/document.controller";

import {
    upload
} from "../middleware/upload.middleware";


const router = Router();


router.post(
    "/upload",

    (
        req,
        res,
        next
    ) => {

        upload.array("files")(req, res, (err) => {

            if (err) {

                return next(err);

            }

            next();

        });

    },

    uploadDocuments
);


router.get(
    "/:id",
    getDocument
);


export default router;