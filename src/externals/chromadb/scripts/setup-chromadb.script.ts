import { CloudClient } from 'chromadb';
import { DefaultEmbeddingFunction } from '@chroma-core/default-embed';
import { Logger } from '@nestjs/common';

import { chromadbConfig } from '../../../config';
import { CHROMA_COLLECTIONS, CHROMA_DOCUMENT_TYPES } from '../../../common/constants/chromadb.constant';

/**
 * Setup script for ChromaDB collection initialization
 * Creates collection and adds sample data if they don't exist
 */
export class ChromaDBSetup {
  private readonly logger = new Logger(ChromaDBSetup.name);
  private readonly client: CloudClient;
  private readonly embeddingFunction = new DefaultEmbeddingFunction();
  private readonly collectionName = CHROMA_COLLECTIONS.EVALUATION_CONTEXT;

  constructor() {
    this.client = new CloudClient({
      apiKey: chromadbConfig.API_KEY,
      tenant: chromadbConfig.TENANT,
      database: chromadbConfig.DATABASE,
    });
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
        'job-backend-senior',
        'job-fullstack-mid',
        'job-frontend-senior',
        'case-ecommerce-api',
        'case-task-management',
        'case-social-feed',
      ],
      documents: [
        // Job Descriptions
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
