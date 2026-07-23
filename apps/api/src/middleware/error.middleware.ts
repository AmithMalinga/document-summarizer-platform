import {
    Request,
    Response,
    NextFunction
} from "express";


export function errorMiddleware(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {


    if (
        err.code === "LIMIT_FILE_SIZE"
    ) {

        return res.status(400).json({

            message:
                "File size exceeds 10MB limit"

        });

    }



    if (
        err.message?.includes(
            "Unsupported file type"
        )
    ) {

        return res.status(400).json({

            message:
                err.message

        });

    }



    return res.status(500).json({

        message:
            "Internal server error"

    });


}