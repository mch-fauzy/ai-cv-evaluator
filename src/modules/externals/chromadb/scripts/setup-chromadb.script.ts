import { CloudClient } from 'chromadb';
import { Logger } from '@nestjs/common';

import { chromadbConfig, openaiConfig } from '../../../../config';
import { CHROMA_COLLECTIONS, CHROMA_DOCUMENT_TYPES } from '../../../../common/constants/chromadb.constant';
import { OpenAIEmbeddingFunction } from '../utils/chromadb-openai-embedding.util';

/**
 * Setup script for ChromaDB collection initialization
 * Creates collection and adds sample data if they don't exist
 */
export class ChromaDBSetup {
  private readonly logger = new Logger(ChromaDBSetup.name);
  private readonly client: CloudClient;
  private readonly collectionName = CHROMA_COLLECTIONS.EVALUATION_CONTEXT;
  private readonly embeddingFunction: OpenAIEmbeddingFunction;

  constructor() {
    this.client = new CloudClient({
      apiKey: chromadbConfig.API_KEY,
      tenant: chromadbConfig.TENANT,
      database: chromadbConfig.DATABASE,
    });

    // Use OpenAI embeddings (lightweight, no local models)
    this.embeddingFunction = new OpenAIEmbeddingFunction(
      openaiConfig.API_KEY,
      openaiConfig.EMBEDDING_MODEL,
    );
  }

  /**
   * Run the setup process
   * Skips insertion if collection already contains data
   */
  async run(): Promise<void> {
    try {
      this.logger.log('Starting ChromaDB setup...');

      // Check if collection exists
      const collections = await this.client.listCollections();
      const exists = collections.some(c => c.name === this.collectionName);

      let collection;
      if (exists) {
        this.logger.log(`Collection "${this.collectionName}" already exists`);
        
        collection = await this.client.getCollection({
          name: this.collectionName,
          embeddingFunction: this.embeddingFunction,
        });

        // Check if collection already has data
        const count = await collection.count();
        if (count > 0) {
          this.logger.log(`Collection already contains ${count} documents. Skipping data insertion.`);
          this.logger.log('ChromaDB setup completed (no changes needed)');
          return;
        }

        this.logger.log('Collection is empty. Adding sample data...');
      } else {
        this.logger.log(`Creating collection "${this.collectionName}"...`);
        collection = await this.client.createCollection({
          name: this.collectionName,
          embeddingFunction: this.embeddingFunction,
        });
        this.logger.log('Collection created successfully');
      }

      // Add sample data
      await this.addSampleData(collection);

      // Verify
      const finalCount = await collection.count();
      this.logger.log(`Setup complete! Collection contains ${finalCount} documents`);
    } catch (error) {
      this.logger.error('ChromaDB setup failed', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /**
   * Add sample job descriptions and case studies
   */
  private async addSampleData(collection: any): Promise<void> {
    this.logger.log('Adding sample job descriptions and case studies...');

    const sampleData = {
      ids: [
        'job-product-engineer-backend',
        'job-backend-senior',
        'job-fullstack-mid',
        'job-frontend-senior',
        'case-ai-cv-evaluator',
        'case-ecommerce-api',
        'case-task-management',
        'case-social-feed',
      ],
      documents: [
        // Job Descriptions
        `Product Engineer (Backend) - Rakamin 2025

About the Job:
Build new product features alongside frontend engineers and product managers using Agile methodology. Write clean, efficient code and work on AI-powered systems, designing and orchestrating how large language models (LLMs) integrate into Rakamin's product ecosystem.

Examples of Work:
- Collaborate with frontend engineers and 3rd parties to build robust backend solutions supporting configurable and cross-platform integration
- Develop and maintain server-side logic for central databases, ensuring high performance and fast response times
- Design and fine-tune AI prompts aligned with product requirements
- Build LLM chaining flows where model outputs feed into subsequent models
- Implement Retrieval-Augmented Generation (RAG) using vector databases for context retrieval
- Handle long-running AI processes with async workers and retry mechanisms
- Design safeguards for 3rd-party API failures and unpredictable LLM outputs
- Use AI tools to boost productivity (AI-assisted code generation, QA, bots)
- Write reusable, testable, efficient code
- Strengthen test coverage with RSpec
- Manage full product lifecycles: design → build → deploy → maintain
- Provide input on technical feasibility and trade-offs
- Engage with users and stakeholders to refine backend and AI-driven improvements

Required Knowledge and Skills:
- Backend frameworks: Node.js, Django, or Rails
- Databases: MySQL, PostgreSQL, MongoDB
- RESTful APIs
- Security compliance
- Cloud platforms: AWS, Google Cloud, Azure
- Server-side languages: Java, Python, Ruby, JavaScript
- Frontend understanding
- Authentication & authorization across systems
- Scalable application design
- Database schema design
- Automated testing & unit testing
- Familiarity with LLM APIs, embeddings, vector databases, and prompt design

Culture:
Managers of One - autonomous and empowered team members who own outcomes. Remote role with flexibility to work from anywhere in Indonesia.`,

        `Senior Backend Developer
Requirements:
- 5+ years of professional backend development experience
- Expert in Node.js and TypeScript
- Strong experience with NestJS framework
- Proficient in PostgreSQL and MongoDB
- Experience with microservices architecture
- Knowledge of Docker and Kubernetes
- Understanding of CI/CD pipelines
- Strong problem-solving and debugging skills
- Experience with RESTful APIs and GraphQL
- Knowledge of authentication/authorization (JWT, OAuth)`,

        `Mid-Level Full Stack Developer
Requirements:
- 3+ years of full-stack development experience
- Proficient in React and Node.js
- Experience with TypeScript
- Knowledge of SQL databases (PostgreSQL preferred)
- Understanding of responsive design
- Experience with version control (Git)
- Good communication skills
- Ability to work in agile teams
- Knowledge of testing frameworks
- Experience with REST APIs`,

        `Senior Frontend Developer
Requirements:
- 5+ years of frontend development experience
- Expert in React and modern JavaScript
- Strong TypeScript skills
- Experience with state management (Redux, Zustand)
- Proficient in CSS-in-JS and responsive design
- Knowledge of performance optimization
- Experience with testing (Jest, React Testing Library)
- Understanding of accessibility (WCAG)
- Experience mentoring junior developers
- Knowledge of build tools (Webpack, Vite)`,

        // Case Study Briefs
        `AI-Powered CV Evaluator System
Build an intelligent CV evaluation platform with AI integration:
- PDF parsing for CV and project portfolio documents
- File upload management with Cloudinary integration
- AI-powered CV analysis using OpenAI GPT models
- Retrieval-Augmented Generation (RAG) with ChromaDB for context-aware evaluation
- Job description semantic search using vector embeddings
- Case study brief matching with vector similarity
- Asynchronous job processing with Bull Queue and Redis
- Evaluation scoring system (technical skills, experience, project quality)
- AI prompt engineering for accurate CV assessment
- PostgreSQL database with TypeORM
- RESTful API with comprehensive Swagger documentation
- Background workers for long-running AI tasks
- Error handling for LLM API failures
- Unit and integration tests with >80% coverage
- NestJS backend with TypeScript
- Deployment on Vercel with serverless architecture`,

        `E-Commerce REST API Project
Build a scalable e-commerce backend with:
- User authentication and authorization
- Product catalog with search and filters
- Shopping cart management
- Order processing and payment integration
- Admin dashboard for inventory management
- Email notifications for order updates
- Rate limiting and security best practices
- Comprehensive API documentation (Swagger)
- Unit and integration tests (>80% coverage)
- Docker containerization
- PostgreSQL database
- TypeScript implementation`,

        `Task Management System
Develop a collaborative task management application with:
- User registration and authentication
- Create/edit/delete tasks with priorities
- Assign tasks to team members
- Real-time updates using WebSockets
- File attachments support (Cloudinary)
- Search and filter functionality
- Dashboard with analytics
- Mobile-responsive design
- TypeScript throughout
- Testing suite with good coverage
- RESTful API design
- Role-based access control`,

        `Social Media Feed Feature
Implement a performant social media feed with:
- Infinite scroll pagination
- Like, comment, and share functionality
- Image/video upload with Cloudinary
- Real-time notifications
- Content moderation system
- Search users and posts
- Responsive design (mobile-first)
- Performance optimization (lazy loading, caching)
- Accessibility compliance
- End-to-end tests
- Database query optimization
- TypeScript and NestJS backend`,
      ],
      metadatas: [
        { type: CHROMA_DOCUMENT_TYPES.JOB_DESCRIPTION },
        { type: CHROMA_DOCUMENT_TYPES.JOB_DESCRIPTION },
        { type: CHROMA_DOCUMENT_TYPES.JOB_DESCRIPTION },
        { type: CHROMA_DOCUMENT_TYPES.JOB_DESCRIPTION },
        { type: CHROMA_DOCUMENT_TYPES.CASE_STUDY },
        { type: CHROMA_DOCUMENT_TYPES.CASE_STUDY },
        { type: CHROMA_DOCUMENT_TYPES.CASE_STUDY },
        { type: CHROMA_DOCUMENT_TYPES.CASE_STUDY },
      ],
    };

    await collection.add(sampleData);

    this.logger.log(`Added ${sampleData.ids.length} sample documents`);
    this.logger.log(`  - ${sampleData.metadatas.filter(m => m.type === CHROMA_DOCUMENT_TYPES.JOB_DESCRIPTION).length} job descriptions`);
    this.logger.log(`  - ${sampleData.metadatas.filter(m => m.type === CHROMA_DOCUMENT_TYPES.CASE_STUDY).length} case study briefs`);
  }
}

/**
 * Execute the setup
 * Run: npm run chromadb:setup
 */
const setup = new ChromaDBSetup();

void setup
  .run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
