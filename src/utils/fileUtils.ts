import { MAX_FILE_SIZE, MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT, IMAGE_QUALITY, ALLOWED_FILE_TYPES } from './constants';

/**
 * Resize and compress an image to meet size requirements
 * @param file The original file to process
 * @param setIsCompressing Function to update compression state
 * @param setOriginalFileSize Function to set original file size
 * @param setCompressedFileSize Function to set compressed file size
 * @returns Promise with the processed file
 */
export const resizeAndCompressImage = (
  file: File,
  setIsCompressing: (isCompressing: boolean) => void,
  setOriginalFileSize: (size: number) => void,
  setCompressedFileSize: (size: number) => void
): Promise<File> => {
  return new Promise((resolve, reject) => {
    setIsCompressing(true);

    // If it's not an image or smaller than the limit, return the original file
    if (!file.type.startsWith('image/') || file.size <= MAX_FILE_SIZE) {
      setIsCompressing(false);
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > MAX_IMAGE_WIDTH) {
          height = (height * MAX_IMAGE_WIDTH) / width;
          width = MAX_IMAGE_WIDTH;
        }

        if (height > MAX_IMAGE_HEIGHT) {
          width = (width * MAX_IMAGE_HEIGHT) / height;
          height = MAX_IMAGE_HEIGHT;
        }

        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // Draw and compress the image
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Use a type-safe approach for canvas.toBlob
        const canvasToBlob = (
          canvas: HTMLCanvasElement,
          type: string,
          quality: number
        ): Promise<Blob> => {
          return new Promise((resolve, reject) => {
            (canvas as HTMLCanvasElement).toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to create blob'));
                  return;
                }
                resolve(blob);
              },
              type,
              quality
            );
          });
        };

        // Use our type-safe function
        canvasToBlob(canvas, file.type, IMAGE_QUALITY)
          .then((blob) => {
            // Create a new file from the blob
            const compressedFile = new Blob([blob], {
              type: file.type,
            }) as unknown as File;

            // Manually set File-specific properties
            Object.defineProperty(compressedFile, 'name', {
              value: file.name,
              writable: false,
            });
            Object.defineProperty(compressedFile, 'lastModified', {
              value: Date.now(),
              writable: false,
            });

            setOriginalFileSize(file.size);
            setCompressedFileSize(compressedFile.size);
            setIsCompressing(false);
            resolve(compressedFile);
          })
          .catch((error) => {
            setIsCompressing(false);
            reject(error);
          });
      };

      img.onerror = () => {
        setIsCompressing(false);
        reject(new Error('Failed to load image'));
      };
    };

    reader.onerror = () => {
      setIsCompressing(false);
      reject(new Error('Failed to read file'));
    };
  });
};

/**
 * Validate a file before upload
 * @param file The file to validate
 * @returns Error message or empty string if valid
 */
export const validateFile = (file: File): string => {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'File type not supported. Please upload an image, PDF, or Office document.';
  }

  // Check initial file size
  if (file.size > 5 * 1024 * 1024) {
    // 5MB hard limit
    return 'File too large. Maximum file size is 5MB.';
  }

  return '';
};

/**
 * Create a file preview for images
 * @param file The file to create a preview for
 * @param callback Function to call with the preview URL
 */
export const createFilePreview = (
  file: File, 
  callback: (previewUrl: string) => void
): void => {
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};