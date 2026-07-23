export interface Summary {

    id: string;

    content: string;

}



export interface Classification {


    id: string;

    category: string;

    confidence: number;

}



export interface Document {


    id: string;


    filename: string;


    originalName: string;


    mimeType: string;


    size: number;


    status:
    | "QUEUED"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED";



    summary?: Summary;



    classification?: Classification;



    createdAt: string;


    updatedAt: string;

}