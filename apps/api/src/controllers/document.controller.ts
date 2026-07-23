import { Request, Response } from "express";
import { prisma } from "@document/database"; // Ensure this matches your Prisma import path
import { getDocumentById } from "../services/document-query.service";
import { createDocument } from "../services/document.service";
import { publishJob } from "../../../worker/src/services/queue.service";

/**
 * Upload one or multiple documents, create DB records, and publish queue jobs.
 */
export async function uploadDocuments(req: Request, res: Response) {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({
                message: "No files uploaded",
            });
        }

        const results = await Promise.all(
            files.map(async (file) => {
                const result = await createDocument(file);

                await publishJob({
                    documentId: result.document.id,
                    jobId: result.job.id,
                });

                return {
                    documentId: result.document.id,
                    jobId: result.job.id,
                    status: result.document.status,
                };
            })
        );

        return res.status(201).json(results);
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
            message: "Upload failed",
        });
    }
}

/**
 * Fetch a single document by ID including its summary and classification.
 */
export async function getDocument(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const document = await getDocumentById(id);

        if (!document) {
            return res.status(404).json({
                message: "Document not found",
            });
        }

        return res.status(200).json(document);
    } catch (error) {
        console.error("Fetch document error:", error);
        return res.status(500).json({
            message: "Failed to fetch document",
        });
    }
}

/**
 * Fetch all documents with summaries and classifications sorted by creation date.
 */
export async function getDocuments(req: Request, res: Response) {
    try {
        const documents = await prisma.document.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                summary: true,
                classification: true,
            },
        });

        return res.status(200).json(documents);
    } catch (error) {
        console.error("Fetch documents error:", error);
        return res.status(500).json({
            message: "Failed to fetch documents",
        });
    }
}