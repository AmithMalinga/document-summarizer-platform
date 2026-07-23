import {
    describe,
    it,
    expect,
    vi,
    beforeEach
} from "vitest";


import {
    processDocument
} from "../services/processor.service";


import prisma from "../database/client";



vi.mock("../services/extractor.service", () => ({

    extractText:
        vi.fn()
            .mockResolvedValue(
                "This is a sample technical document about system architecture"
            )

}));



describe(
    "Document Processing Pipeline",
    () => {


        beforeEach(
            () => {

                vi.clearAllMocks();

            }
        );



        it(
            "should process document and generate summary",
            async () => {


                const documentId =
                    "test-document-id";


                const jobId =
                    "test-job-id";



                prisma.job.findUnique =
                    vi.fn()
                        .mockResolvedValue({

                            id: jobId,

                            status:
                                "QUEUED"

                        }) as any;



                prisma.job.update =
                    vi.fn()
                        .mockResolvedValue({}) as any;



                prisma.document.update =
                    vi.fn()
                        .mockResolvedValue({}) as any;



                prisma.document.findUnique =
                    vi.fn()
                        .mockResolvedValue({

                            id: documentId,

                            originalName:
                                "sample.pdf",

                            storageKey:
                                "./sample.pdf",

                            mimeType:
                                "application/pdf"

                        }) as any;



                prisma.summary.create =
                    vi.fn()
                        .mockResolvedValue({}) as any;



                prisma.classification.create =
                    vi.fn()
                        .mockResolvedValue({}) as any;



                await processDocument(
                    documentId,
                    jobId
                );



                expect(
                    prisma.summary.create
                )
                    .toHaveBeenCalled();



                expect(
                    prisma.classification.create
                )
                    .toHaveBeenCalled();



                expect(
                    prisma.document.update
                )
                    .toHaveBeenCalled();



                expect(
                    prisma.job.update
                )
                    .toHaveBeenCalled();



            }
        );


    }
);