# AI CV Evaluator API

A modern AI-powered API service for evaluating CVs and project reports against job requirements using RAG (Retrieval-Augmented Generation) and OpenAI GPT models.

## Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [ChromaDB Setup](#chromadb-setup)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)

## Requirements

- Node.js >= 22.14.0
- PostgreSQL database
- Redis (for background job processing)
- ChromaDB instance (local or cloud)
- Cloudinary account
- OpenAI API key

## Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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

### Swagger UI

The API includes interactive Swagger documentation:

- **Swagger UI**: Navigate to `http://localhost:3000/api/docs` when the application is running
