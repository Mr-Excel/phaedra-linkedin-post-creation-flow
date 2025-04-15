import React, { useState, useEffect } from 'react';
import {
  Check,
  X,
  ChevronDown,
  Upload,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { PreviewDialogProps, PostType } from './types';
import { ANIMATIONS } from '../../utils/constants';

const PreviewDialog: React.FC<PreviewDialogProps> = ({
  isDialogOpen,
  closeDialog,
  previewText,
  setPreviewText,
  handleUpload,
  isUploading,
  errorMessage,
  successMessage,
  postType,
  titles = [],
  selectedTitle = '',
  setSelectedTitle = () => {},
  previewImage,
  compressedFileSize,
  originalFileSize,
}) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [dialogAnimation, setDialogAnimation] = useState<string>(
    ANIMATIONS.HIDDEN
  );
  const [overlayAnimation, setOverlayAnimation] = useState<string>(
    ANIMATIONS.OVERLAY_HIDDEN
  );

  // Toggle between edit and preview modes
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Handle dialog animations
  useEffect(() => {
    if (isDialogOpen) {
      setOverlayAnimation(ANIMATIONS.OVERLAY_HIDDEN);
      setDialogAnimation(ANIMATIONS.HIDDEN);

      // Trigger animations after a small delay to ensure DOM elements are ready
      setTimeout(() => {
        setOverlayAnimation(ANIMATIONS.OVERLAY_VISIBLE);
        setDialogAnimation(ANIMATIONS.VISIBLE);
      }, 10);
    }
  }, [isDialogOpen]);

  // Listen for ESC key to close dialog
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDialogOpen) {
        closeDialog();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isDialogOpen, closeDialog]);

  // Check if title selection is required (only for text posts)
  const isTitleRequired = postType === PostType.WithoutPhoto;
  const isTitleSelected = !isTitleRequired || selectedTitle !== '';

  return (
    <>
      {isDialogOpen && (
        <div
          className={`fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 transition-opacity duration-200 ${overlayAnimation}`}
          onClick={closeDialog}
        >
          <div
            className={`bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl transition-all duration-200 ${dialogAnimation}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog header */}
            <div className='p-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-xl'>
              <h2 className='text-xl font-semibold flex items-center'>
                <Check className='mr-2 h-5 w-5' />
                Content Processed Successfully
              </h2>
              <button
                onClick={closeDialog}
                className='text-white/80 hover:text-white focus:outline-none transition-colors'
              >
                <X className='h-6 w-6' />
              </button>
            </div>

            {/* Title selection - Only for WithoutPhoto posts */}
            {postType === PostType.WithoutPhoto && (
              <div className='px-6 pt-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Select a title for your LinkedIn post
                </label>
                <div className='space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar'>
                  {titles.map((title, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedTitle(title)}
                      className={`py-3 w-full px-4 rounded-lg cursor-pointer transition-all duration-200 flex items-center ${
                        title === selectedTitle
                          ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-md'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {title === selectedTitle && (
                        <Check className='mr-2 h-4 w-4 flex-shrink-0' />
                      )}
                      <span className='text-sm font-medium'>{title}</span>
                    </div>
                  ))}
                </div>
                {!selectedTitle && (
                  <p className='text-amber-600 text-sm mt-2 flex items-center'>
                    <AlertCircle className='h-4 w-4 mr-1' />
                    Please select a title for your post
                  </p>
                )}
              </div>
            )}

            {/* Content preview */}
            <div className='p-6 overflow-auto flex-1'>
              <div className='flex justify-between items-center mb-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Post Content
                </label>
                <button
                  type='button'
                  onClick={togglePreview}
                  className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center'
                >
                  {showPreview ? 'Edit' : 'Preview'}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform ${
                      showPreview ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {showPreview ? (
                <div className='w-full p-4 border border-gray-300 rounded-lg bg-gray-50 min-h-32 whitespace-pre-wrap'>
                  {previewText}
                </div>
              ) : (
                <textarea
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className='w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-32 focus:outline-none'
                />
              )}

              {/* Attachment preview in dialog */}
              {previewImage && (
                <div className='mt-4'>
                  <div className='flex justify-between items-center mb-2'>
                    <label className='block text-sm font-medium text-gray-700 flex items-center'>
                      <ImageIcon className='h-4 w-4 mr-2 text-gray-500' />
                      Attachment Preview
                    </label>

                    {/* Show compression info */}
                    {compressedFileSize > 0 &&
                      originalFileSize > compressedFileSize && (
                        <span className='text-xs text-green-600'>
                          Optimized: {(compressedFileSize / 1024).toFixed(1)} KB
                          (
                          {Math.round(
                            (1 - compressedFileSize / originalFileSize) * 100
                          )}
                          % smaller)
                        </span>
                      )}
                  </div>
                  <div className='border border-gray-300 rounded-lg overflow-hidden bg-gray-50 p-2'>
                    <img
                      src={previewImage}
                      alt='Attachment Preview'
                      className='max-h-60 mx-auto object-contain rounded'
                    />
                  </div>
                </div>
              )}

              {/* Status messages */}
              {successMessage && (
                <div className='mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start animate-fadeIn'>
                  <Check className='text-green-500 mr-3 flex-shrink-0 h-5 w-5 mt-0.5' />
                  <p className='text-green-700'>{successMessage}</p>
                </div>
              )}

              {errorMessage && (
                <div className='mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start animate-fadeIn'>
                  <AlertCircle className='text-red-500 mr-3 flex-shrink-0 h-5 w-5 mt-0.5' />
                  <p className='text-red-700'>{errorMessage}</p>
                </div>
              )}
            </div>

            {/* Dialog footer */}
            <div className='p-6 border-t border-gray-200 flex justify-end gap-3'>
              <button
                onClick={closeDialog}
                className='py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors'
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                disabled={isUploading || !isTitleSelected}
                className={`flex items-center py-2 px-6 rounded-lg text-white font-medium transition-all ${
                  isUploading || !isTitleSelected
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className='animate-spin mr-2 h-5 w-5' />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className='mr-2 h-5 w-5' />
                    Post to LinkedIn
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewDialog;
