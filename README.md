# Scalable Document Summarization Platform

A full-stack document processing platform that supports multi-file upload, asynchronous processing, document parsing, AI-powered summarization, classification, and real-time status updates.

## Features

- Multiple document upload
- Asynchronous background processing
- RabbitMQ based job queue
- PDF text extraction
- Plain text extraction
- Image OCR processing
- AI summarization and classification
- Document category prediction
- Confidence score generation
- Processing status tracking
- Document preview and result dashboard
- Retry-safe background jobs
- PostgreSQL persistence


# System Architecture

The system follows a distributed architecture:

```
                User
                 |
                 |
          Next.js Frontend
                 |
                 |
            Express API
                 |
        -----------------
        |               |
    PostgreSQL       RabbitMQ
        |               |
        |          Worker Service
        |               |
        |       -----------------
        |       |               |
        |   Document Parser   AI Service
        |       |
        |   PDF / TXT / OCR
        |
        |
    Results Storage
```


# Technology Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS


## Backend API

- Node.js
- Express
- TypeScript
- Prisma ORM


## Worker Service

- Node.js
- RabbitMQ Consumer
- PDF Parser
- Tesseract OCR


## Database

- PostgreSQL


## Queue

- RabbitMQ


## AI Integration

The application uses an AI service abstraction.

Currently:

- LLM compatible adapter architecture
- Mock AI implementation for local demonstration

Production replacement:

- OpenAI API
- Azure OpenAI
- Other NLP providers


# Project Structure

```
apps
|
├── web
|    └── Next.js frontend
|
├── api
|    └── REST API service
|
└── worker
     └── Background processing service
```


# Local Setup


## Prerequisites

Install:

- Node.js 22+
- pnpm
- Docker


# Environment Variables


## API

Create:

```
apps/api/.env
```


Example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/documents

RABBITMQ_URL=amqp://guest:guest@localhost:5672

PORT=4000
```


## Worker

Create:

```
apps/worker/.env
```


Example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/documents

RABBITMQ_URL=amqp://guest:guest@localhost:5672

AI_PROVIDER=mock
```


## Frontend

Create:

```
apps/web/.env.local
```


Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```


# Running the Application


## Start Infrastructure


```
docker compose up -d
```


This starts:

- PostgreSQL
- RabbitMQ


## Install Dependencies


From root:

```
pnpm install
```


## Run Database Migration


```
pnpm prisma migrate dev
```


## Start API


```
cd apps/api

pnpm dev
```


API runs:

```
http://localhost:4000
```


## Start Worker


```
cd apps/worker

pnpm dev
```


## Start Frontend


```
cd apps/web

pnpm dev
```


Frontend:

```
http://localhost:3000
```



# Processing Flow


1. User uploads multiple documents

2. API validates files

3. Files are stored locally

4. Document metadata is saved

5. Processing job is created

6. Job is pushed into RabbitMQ

7. Worker consumes job

8. Worker extracts content:

   - PDF parser
   - Text parser
   - OCR


9. AI service generates:

   - Summary
   - Category
   - Confidence


10. Results are saved

11. Frontend receives updated status


# Supported Files


| Type | Support |
|-|-|
| PDF | Yes |
| TXT | Yes |
| PNG | Yes |
| JPEG | Yes |
| WEBP | Yes |


# API Endpoints


## Upload Documents

```
POST /documents/upload
```


Accepts:

```
multipart/form-data
```


Example:

```
files=file1.pdf
files=file2.png
```


## Get Documents


```
GET /documents
```


## Get Single Document


```
GET /documents/:id
```


# Testing


Run:

```
pnpm test
```


# Production Improvements

See:

```
ASSUMPTIONS_AND_LIMITATIONS.md
```

and

```
SYSTEM_DESIGN.md
```

## Incomplete Areas & Future Improvements

The current implementation focuses on demonstrating the core scalable document processing workflow within the assignment timeframe.

### Current Limitations

- Authentication and user management are not implemented. The current version assumes a single authenticated session.
- Local file storage is used for development. A production deployment would use object storage such as AWS S3 or Azure Blob Storage.
- OCR support is implemented using Tesseract.js but may require optimization for large-scale image processing.
- The AI summarization and classification layer is implemented through an LLM service adapter. Additional prompt optimization and evaluation pipelines would be required for production accuracy.
- Real-time updates currently use polling. WebSocket or Server-Sent Events could be introduced for large-scale deployments.
- Malware scanning and advanced file security validation are not included.

### Production Improvements

With additional development time, the following improvements would be considered:

- Add authentication and role-based access control.
- Introduce cloud object storage with signed URLs.
- Add document retention policies and automated cleanup.
- Implement Redis-based caching for frequently accessed results.
- Add dead-letter queue handling and retry dashboards.
- Add distributed tracing using OpenTelemetry.
- Add monitoring dashboards using Prometheus and Grafana.
- Improve AI evaluation using benchmark datasets.
- Add comprehensive automated testing for API, worker, and frontend flows.
- Containerize and deploy using Kubernetes with horizontal scaling.

### Assumptions

- The system is designed for a single-user demonstration environment.
- PostgreSQL is used as the persistent datastore.
- RabbitMQ provides reliable asynchronous job delivery.
- The AI provider integration is abstracted to allow replacement with OpenAI or another production NLP provider.
- Processing failures are expected and handled through document/job status updates.