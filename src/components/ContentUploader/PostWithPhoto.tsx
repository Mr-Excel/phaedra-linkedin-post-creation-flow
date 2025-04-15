/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, FormEvent } from 'react';
import { Globe, Edit3, Send, Loader2, Paperclip } from 'lucide-react';
import { PostType } from './types';
import FileUploader from './FileUploader';
import StatusMessages from './StatusMessages';
import PreviewDialog from './PreviewDialog';
import { processContent, uploadToLinkedIn } from '../../utils/api';

const PostWithPhoto: React.FC = () => {
  // State management
  const [url, setUrl] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [previewText, setPreviewText] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalFileSize, setOriginalFileSize] = useState<number>(0);
  const [compressedFileSize, setCompressedFileSize] = useState<number>(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [attachmentForUpload, setAttachmentForUpload] = useState<File | null>(
    null
  );
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  // Handle content change and update character count
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setCharacterCount(newContent.length);
  };

  // Open dialog
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // Close dialog
  const closeDialog = () => {
    setTimeout(() => {
      setIsDialogOpen(false);
      setSuccessMessage('');
    }, 200);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate inputs
    if (!url.trim()) {
      setErrorMessage('URL is required');
      return;
    }

    if (!content.trim()) {
      setErrorMessage('Content is required');
      return;
    }

    // Validate that we have a photo (required for this post type)
    if (!selectedFile) {
      setErrorMessage('Photo is required for this post type');
      return;
    }

    // Check if an image is being uploaded and is still compressing
    if (isCompressing) {
      setErrorMessage('Please wait for image processing to complete');
      return;
    }

    try {
      setIsLoading(true);

      // Process the content with API
      const response = await processContent(url, content, selectedFile);

      // Save the processed content and prepare for upload
      setPreviewText(response.content);
      setAttachmentForUpload(selectedFile);

      // Open the preview dialog
      openDialog();
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to process content');
      console.error('Error processing content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    try {
      setIsUploading(true);
      setErrorMessage('');

      // Upload to LinkedIn
      await uploadToLinkedIn(url, previewText, undefined, attachmentForUpload);

      setSuccessMessage('Content uploaded successfully to LinkedIn!');

      // Reset form after successful upload
      setTimeout(() => {
        closeDialog();
        resetForm();
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to upload content');
      console.error('Error uploading:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Reset form and states
  const resetForm = () => {
    setUrl('');
    setContent('');
    setPreviewText('');
    setErrorMessage('');
    setSuccessMessage('');
    setCharacterCount(0);
    setSelectedFile(null);
    setPreviewImage(null);
    setAttachmentName('');
    setAttachmentForUpload(null);
    setOriginalFileSize(0);
    setCompressedFileSize(0);
  };

  return (
    <div className='space-y-6'>
      {/* Error/Success messages */}
      <StatusMessages
        errorMessage={errorMessage}
        successMessage={successMessage}
        setErrorMessage={setErrorMessage}
        setSuccessMessage={setSuccessMessage}
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* URL input */}
        <div className='space-y-2'>
          <label
            htmlFor='url'
            className='text-sm font-medium text-gray-700 flex items-center'
          >
            <Globe className='h-4 w-4 mr-2 text-gray-500' />
            Website URL
          </label>
          <div className='relative'>
            <input
              id='url'
              type='text'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder='https://example.com'
              className='w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm'
            />
          </div>
        </div>

        {/* Content textarea */}
        <div className='space-y-2'>
          <label
            htmlFor='content'
            className='text-sm font-medium text-gray-700 flex items-center'
          >
            <Edit3 className='h-4 w-4 mr-2 text-gray-500' />
            Content
          </label>
          <div className='relative'>
            <textarea
              id='content'
              value={content}
              onChange={handleContentChange}
              placeholder='Enter your content here...'
              rows={6}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm resize-y'
            />
            <div className='absolute right-2 bottom-2 text-xs text-gray-500'>
              {characterCount} characters
            </div>
          </div>
        </div>

        {/* File upload section */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700 flex items-center'>
            <Paperclip className='h-4 w-4 mr-2 text-gray-500' />
            Photo (Required)
          </label>

          <FileUploader
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            attachmentName={attachmentName}
            setAttachmentName={setAttachmentName}
            originalFileSize={originalFileSize}
            setOriginalFileSize={setOriginalFileSize}
            compressedFileSize={compressedFileSize}
            setCompressedFileSize={setCompressedFileSize}
            isCompressing={isCompressing}
            setIsCompressing={setIsCompressing}
            setErrorMessage={setErrorMessage}
          />
        </div>

        {/* Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 pt-2'>
          <button
            type='button'
            onClick={resetForm}
            className='sm:order-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2'
          >
            Reset
          </button>

          <button
            type='submit'
            disabled={isLoading || isCompressing}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all ${
              isLoading || isCompressing
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className='animate-spin mr-2 h-5 w-5' />
                Processing...
              </>
            ) : isCompressing ? (
              <>
                <Loader2 className='animate-spin mr-2 h-5 w-5' />
                Optimizing Image...
              </>
            ) : (
              <>
                <Send className='mr-2 h-5 w-5' />
                Process Content
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preview Dialog */}
      <PreviewDialog
        isDialogOpen={isDialogOpen}
        closeDialog={closeDialog}
        previewText={previewText}
        setPreviewText={setPreviewText}
        url={url}
        handleUpload={handleUpload}
        isUploading={isUploading}
        errorMessage={errorMessage}
        successMessage={successMessage}
        setErrorMessage={setErrorMessage}
        postType={PostType.WithPhoto}
        previewImage={previewImage}
        compressedFileSize={compressedFileSize}
        originalFileSize={originalFileSize}
      />
    </div>
  );
};

export default PostWithPhoto;
