// API URL
export const API_URL = 'https://n8n.megatourn.com/webhook/linkedin-post-trigger';

// File upload configuration
export const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB max file size
export const MAX_IMAGE_WIDTH = 1200; // Maximum image width
export const MAX_IMAGE_HEIGHT = 1200; // Maximum image height
export const IMAGE_QUALITY = 0.8; // Image compression quality (0.8 = 80%)
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
];

// API request categories
export const CATEGORIES = {
  PROCESS_CONTENT: 0,
  UPLOAD_TO_LINKEDIN_WITH_IMAGE: 1,
  UPLOAD_TO_LINKEDIN: 2
};

// Animation states
export const ANIMATIONS = {
  HIDDEN: 'scale-95 opacity-0',
  VISIBLE: 'scale-100 opacity-100',
  OVERLAY_HIDDEN: 'opacity-0',
  OVERLAY_VISIBLE: 'opacity-100'
};