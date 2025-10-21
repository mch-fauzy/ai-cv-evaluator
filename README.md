# AI CV Evaluator API

A modern AI-powered API service for evaluating CVs and project reports against job requirements using RAG (Retrieval-Augmented Generation) and OpenAI GPT models.

**[Live Demo - Interactive API Documentation](https://ai-cv-evaluator.onrender.com)**

## Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [ChromaDB Setup](#chromadb-setup)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Design Choices](#design-choices)
  - [Architecture](#architecture)
  - [Technology Stack](#technology-stack)
  - [Key Design Decisions](#key-design-decisions)
  - [Scalability](#scalability)

## Requirements

- Node.js >= 22.x
- PostgreSQL database
- Redis (for background job processing)
- ChromaDB instance (local or cloud)
- Cloudinary account
- OpenAI API key

## Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mch-fauzy/ai-cv-evaluator.git
   cd ai-cv-evaluator
   ```

2. **Setup environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your credentials:
   ```env
   # Database
   POSTGRES_HOST='localhost'
   POSTGRES_PORT=5432
   POSTGRES_DATABASE='your_database'
   POSTGRES_USERNAME='your_username'
   POSTGRES_PASSWORD='your_password'
   POSTGRES_SSL=false
   
   # Redis
   REDIS_URL='redis://localhost:6379'
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME='your_cloud_name'
   CLOUDINARY_API_KEY='your_api_key'
   CLOUDINARY_API_SECRET='your_api_secret'
   CLOUDINARY_FILE_STORAGE_DIRECTORY='your_directory'
   
   # ChromaDB
   CHROMADB_TENANT='your_tenant'
   CHROMADB_DATABASE='your_database'
   CHROMADB_API_KEY='your_api_key'
   
   # OpenAI
   OPENAI_API_KEY='your_openai_api_key'
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

### Database Setup

1. **Apply migrations to database**
   ```bash
   npm run migrate:run
   ```

2. **Add a new migration (optional, only for development)**
   ```bash
   npm run migrate:generate MigrationName
   ```
   Example:
   ```bash
   npm run migrate:generate AddEvaluationTable
   ```

### ChromaDB Setup

1. **Initialize ChromaDB collection with sample data**
   ```bash
   npm run chromadb:setup
   ```
   
   This will create the `evaluation_context` collection and populate it with sample job descriptions and case study briefs.

2. **Reset ChromaDB collection (optional)**
   
   If you need to delete the existing collection and start fresh:
   ```bash
   npm run chromadb:reset
   ```
   
   After resetting, run the setup command again to recreate the collection:
   ```bash
   npm run chromadb:setup
   ```

### Running the Application

1. **Start Redis (required for background jobs)**
   ```bash
   sudo systemctl start redis-server
   # or
   redis-server
   ```

2. **Build and run the application**
   ```bash
   # Development mode with hot reload
   npm run start:dev
   
   # Production mode
   npm run build
   npm start
   ```

The API will be available at:
- HTTP: `http://localhost:3000`

## API Documentation

### Live Demo

**Interactive Swagger Documentation is Available Online:**

> 📖 **Access the API docs at:** [https://ai-cv-evaluator.onrender.com](https://ai-cv-evaluator.onrender.com)

### Local Development

The API includes interactive Swagger documentation when running locally:

- **Swagger UI**: Navigate to `http://localhost:3000/api/docs` when the application is running

## Design Choices

### Architecture

**Layered Architecture**
- **Controllers**: HTTP request/response handling
- **Services**: Business logic (decoupled and testable)
- **Repositories**: Database operations
- **Workers**: Background job processing
- **Modules**: Feature-based organization (Upload, Evaluation, Result, Externals)

### Technology Stack

**Backend Framework: NestJS**
- TypeScript-first with built-in dependency injection
- Decorator-based routing and validation
- Modular design for clean architecture

**Database: PostgreSQL + TypeORM**
- Type-safe database operations
- Migration system for schema versioning
- Support for complex relationships

**Queue System: Bull + Redis**
- Asynchronous processing for long-running AI tasks
- Prevents API timeouts
- Automatic retry mechanisms

**AI Integration**
- **OpenAI GPT-4o-mini**: CV analysis and scoring
- **ChromaDB**: Vector database for RAG (semantic search)
- **OpenAI Embeddings**: text-embedding-3-small

**File Storage: Cloudinary**
- Cloud-based PDF storage
- Easy setup

### Key Design Decisions

**1. Asynchronous Evaluation**
- Background workers process CV evaluation to avoid timeouts
- Immediate response with evaluation ID
- Results retrieved via separate endpoint

**2. RAG (Retrieval-Augmented Generation)**
- ChromaDB stores job descriptions and case studies with embeddings
- Semantic search provides relevant context to AI
- Reduces hallucination and improves accuracy

**3. Type Safety**
- TypeScript throughout with Zod validation
- Compile-time error detection
- Strongly typed API responses

**4. Error Handling**
- Centralized exception handling

**5. Deployment**
- **Platform**: Render (free tier)
- **Keep-Alive**: Cron-job.org prevents auto-sleep (15 min)
- **CI/CD**: Auto-deploy on git push
- **Config**: Infrastructure as code with `render.yaml`

### Scalability

**Horizontal Scaling**
- Redis-backed distributed job queue
- PostgreSQL read replicas support

**Performance**
- Redis caching
- Database indexing and query optimization
- Pagination for large datasets

**Monitoring & High Availability**
- Structured logging for debugging
- Health check endpoint for uptime monitoring
- Cron-job.org ensures 24/7 availability (keeps Render free tier awake)
- Job queue monitoring for background tasks
