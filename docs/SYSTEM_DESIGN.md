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