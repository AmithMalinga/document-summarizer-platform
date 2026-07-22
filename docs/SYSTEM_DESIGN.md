# Document Summarization Platform

## Technology Decisions

Frontend:
- Next.js
- React
- TypeScript

Backend:
- NestJS
- PostgreSQL
- Prisma

Background Processing:
- RabbitMQ
- Node.js Worker

Storage:
- MinIO Object Storage

AI:
- Provider Adapter Pattern
- Mock implementation initially

## Database Layer

Database:
- PostgreSQL

ORM:
- Prisma

Reason:
- Strong relational modeling
- Type-safe database access
- Migration support
- Suitable for production scaling

## Database

Technology:
- PostgreSQL 17
- Prisma ORM

Entities:
- Document
- Job
- ProcessingAttempt
- Summary
- Classification

Migration Strategy:
- Prisma migrations are version controlled.
- Database changes are applied using `prisma migrate`.
- All migrations are committed to source control.

Persistence Guarantees:
- Document state survives service restarts.
- Job retries are tracked.
- Processing history is retained.

## Database Implementation

The platform uses PostgreSQL with Prisma ORM.

A shared database package is used by both API and worker services.

Architecture:

API Service
    |
    |
Database Package
    |
    |
Prisma Client
    |
    |
PostgreSQL


Worker Service
    |
    |
Database Package
    |
    |
Prisma Client
    |
    |
PostgreSQL


Entities:

### Document
Stores uploaded document metadata, storage reference, and current processing state.

### Job
Represents asynchronous processing work created after upload.

### ProcessingAttempt
Stores individual worker execution attempts and failures.

### Summary
Stores generated document summaries.

### Classification
Stores predicted document category and confidence score.


Migration Strategy:

Database changes are managed through Prisma migrations.
Migration files are committed to source control and applied during deployment.

## Upload Validation

Supported file types:
- PDF
- PNG/JPEG/WebP images
- Plain text

Limits:
- Maximum file size: 10MB
- Maximum files per request: 10

Validation occurs before persistence.
Rejected files never create database records.