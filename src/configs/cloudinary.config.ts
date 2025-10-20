export const cloudinaryConfig = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
  FILE_STORAGE_DIRECTORY: process.env.CLOUDINARY_FILE_STORAGE_DIRECTORY || 'ai-cv-evaluator/files',
} as const;
