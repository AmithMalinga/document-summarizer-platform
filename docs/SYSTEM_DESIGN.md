# System Design Document

## Scalable Document Summarization Platform


## 1. Architecture Overview


The platform uses an asynchronous distributed architecture.


Components:

- Next.js Web Application
- Express API Service
- PostgreSQL Database
- RabbitMQ Message Queue
- Background Worker Service
- File Storage Layer
- AI Processing Layer



## Architecture Diagram


```
                 Client
                   |
                   |
              Next.js App
                   |
                   |
              Express API
                   |
        -----------------------
        |                     |
   PostgreSQL              RabbitMQ
        |                     |
        |              Worker Service
        |                     |
        |          --------------------
        |          |                  |
    Metadata    Document Parser    AI Service

```



# 2. Request Flow


## Upload Flow


1. User selects multiple files.

2. Frontend sends multipart request.

3. API validates:

- File type
- File size
- File count


4. Files are stored.

5. Document records are created.

6. Jobs are inserted into RabbitMQ.

7. API immediately responds.



## Processing Flow


1. Worker receives job.

2. Worker changes status:

QUEUED → PROCESSING


3. Document content extraction:

- PDF parser
- TXT parser
- OCR


4. AI service generates:

- Summary
- Classification
- Confidence


5. Results saved.

6. Status updated:

PROCESSING → COMPLETED



# 3. Database Design


## Document


Stores uploaded file information.


Fields:

- id
- filename
- storageKey
- mimeType
- status
- createdAt



## Job


Tracks background processing.


Fields:

- id
- documentId
- status
- attempts
- completedAt



## Summary


Stores generated summary.


Fields:

- documentId
- content



## Classification


Stores prediction.


Fields:

- documentId
- category
- confidence



# 4. Queue Design


RabbitMQ is used because:


- Reliable delivery
- Message acknowledgement
- Worker scaling
- Retry support


## Delivery


Messages are acknowledged after successful processing.


## Duplicate Handling


Workers check existing job state before processing.


Completed jobs are ignored.



# 5. Scaling Strategy


## API Scaling

Multiple API instances can run behind a load balancer.


## Worker Scaling


Multiple workers can consume from the same queue.


Example:


```
RabbitMQ

Worker 1
Worker 2
Worker 3

```


# 6. Failure Handling


## Worker Failure


Message remains available and can be retried.


## Invalid Document


Document marked:

FAILED


Other jobs continue processing.


## AI Provider Failure


Retry with backoff.



# 7. Security


Implemented:

- File validation
- File size limits
- MIME validation
- Environment based secrets


Production improvements:

- Authentication
- Authorization
- Virus scanning
- Encryption


# 8. Observability


Recommended:

- Structured logs
- Metrics
- Distributed tracing
- Health checks


# 9. Trade-offs


## Local Storage


Chosen for development simplicity.


Production:

Use:

- AWS S3
- Azure Blob Storage


## Mock AI


Chosen because assignment allows deterministic implementation.


Production:

Replace adapter with:

- OpenAI
- Azure OpenAI

