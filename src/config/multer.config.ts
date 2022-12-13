import { multerConfig } from './reference/multer.reference';

// Multer upload options
export const multerOptions = {
  limits: {
    fileSize: multerConfig.maxFileSizeBytes,
  },
};
