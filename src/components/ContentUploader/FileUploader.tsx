import React, { useRef, ChangeEvent } from 'react';
import { Upload, X, File as FileIcon, Loader2 } from 'lucide-react';
import { FileUploaderProps } from './types';
import {
  validateFile,
  resizeAndCompressImage,
  createFilePreview,
} from '../../utils/fileUtils';

const FileUploader: React.FC<FileUploaderProps> = ({
  selectedFile,
  setSelectedFile,
  previewImage,
  setPreviewImage,
  attachmentName,
  setAttachmentName,
  originalFileSize,
  setOriginalFileSize,
  compressedFileSize,
  setCompressedFileSize,
  isCompressing,
  setIsCompressing,
  setErrorMessage,
}) => {
  // File input ref for programmatic access
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection with validation and compression
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    // Validate the file
    const errorMsg = validateFile(file);
    if (errorMsg) {
      setErrorMessage(errorMsg);
      resetFileInput();
      return;
    }

    try {
      // Process the file (compress if it's an image)
      const processedFile = await resizeAndCompressImage(
        file,
        setIsCompressing,
        setOriginalFileSize,
        setCompressedFileSize
      );

      // Update state with the processed file
      setSelectedFile(processedFile);
      setAttachmentName(file.name);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        createFilePreview(processedFile, (previewUrl) => {
          setPreviewImage(previewUrl);
        });
      } else {
        setPreviewImage(null);
      }

      // Clear any previous error messages
      setErrorMessage('');
    } catch (error) {
      console.error('File processing error:', error);
      setErrorMessage('Failed to process the file. Please try again.');
      resetFileInput();
    }
  };

  // Programmatically trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Remove the selected file
  const removeFile = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setAttachmentName('');
    setOriginalFileSize(0);
    setCompressedFileSize(0);
    resetFileInput();
  };

  // Reset file input
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='space-y-2'>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        className='hidden'
        accept='image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
      />

      {!selectedFile ? (
        <div
          onClick={triggerFileUpload}
          className='border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors'
        >
          <Upload className='h-8 w-8 text-gray-400 mb-2' />
          <p className='text-sm text-gray-500 text-center'>
            Click to upload a file or image
            <br />
            <span className='text-xs'>
              Supported formats: Images, PDF, Office documents
            </span>
            <br />
            <span className='text-xs text-blue-600 font-medium'>
              Maximum file size: 1MB (larger images will be compressed)
            </span>
          </p>
        </div>
      ) : (
        <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              {previewImage ? (
                <div className='h-12 w-12 rounded overflow-hidden bg-gray-100 mr-3 flex-shrink-0'>
                  <img
                    src={previewImage}
                    alt='Preview'
                    className='h-full w-full object-cover'
                  />
                </div>
              ) : (
                <div className='h-12 w-12 rounded bg-blue-100 mr-3 flex-shrink-0 flex items-center justify-center'>
                  <FileIcon className='h-6 w-6 text-blue-600' />
                </div>
              )}
              <div>
                <p className='text-sm font-medium text-gray-700 truncate max-w-xs'>
                  {attachmentName}
                </p>
                <p className='text-xs text-gray-500'>
                  {selectedFile.type.startsWith('image/')
                    ? 'Image'
                    : 'Document'}{' '}
                  • {(selectedFile.size / 1024).toFixed(1)} KB
                  {/* Show compression info if applicable */}
                  {compressedFileSize > 0 &&
                    originalFileSize > compressedFileSize && (
                      <span className='text-green-600 ml-1'>
                        (
                        {Math.round(
                          (1 - compressedFileSize / originalFileSize) * 100
                        )}
                        % compressed)
                      </span>
                    )}
                </p>
              </div>
            </div>
            <button
              type='button'
              onClick={removeFile}
              className='text-gray-400 hover:text-red-500 transition-colors'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          {/* Image preview section if it's an image */}
          {previewImage && (
            <div className='mt-3 pt-3 border-t border-gray-200'>
              <p className='text-xs text-gray-500 mb-2'>Preview:</p>
              <div className='rounded-lg overflow-hidden bg-white border border-gray-200'>
                <img
                  src={previewImage}
                  alt='Preview'
                  className='max-h-40 mx-auto object-contain'
                />
              </div>
            </div>
          )}

          {/* Loading indicator for compression */}
          {isCompressing && (
            <div className='mt-2 flex items-center justify-center text-sm text-blue-600'>
              <Loader2 className='animate-spin mr-2 h-4 w-4' />
              Optimizing image...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
