import {
    Request,
    Response,
    NextFunction
} from "express";

import multer from "multer";


export function errorMiddleware(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {


    console.error(err);


    if (err instanceof multer.MulterError) {

        return res.status(400).json({

            message: err.message

        });

    }


    return res.status(400).json({

        message:
            err.message || "Something went wrong"

    });

}