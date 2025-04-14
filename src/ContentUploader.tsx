import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import {
  AlertCircle,
  Check,
  Loader2,
  Send,
  Upload,
  X,
  ChevronDown,
  Edit3,
  Globe,
} from 'lucide-react';
import axios from 'axios'; // Ensure axios is imported

const URL = 'https://n8n.megatourn.com/webhook/linkedin-post-trigger';

const ContentUploader = () => {
  // State management
  const [url, setUrl] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [previewText, setPreviewText] = useState<string>('');
  const [titles, setTitles] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [dialogAnimation, setDialogAnimation] =
    useState<string>('scale-95 opacity-0');
  const [overlayAnimation, setOverlayAnimation] = useState<string>('opacity-0');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [characterCount, setCharacterCount] = useState<number>(0);

  // Handle content change and update character count
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setCharacterCount(newContent.length);
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

    try {
      setIsLoading(true);

      const response = await axios.post(
        URL,
        {
          category: 0, // tell that it's a content creation body
          url,
          content,
        },
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      );
      const { data } = response;

      setTitles(data.titles);
      setPreviewText(data.content);
      openDialog();
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to process content. Please try again.');
      console.error('Error processing content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedTitle) {
      setErrorMessage('Please select a title');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage('');

      await axios.post(
        URL,
        {
          category: 1, // tell that it's a upload content to linkedin
          post: previewText,
          url,
          selectedTitle,
        },
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      );

      setSuccessMessage('Content uploaded successfully to LinkedIn!');

      // Reset form after successful upload
      setTimeout(() => {
        closeDialog();
        setUrl('');
        setContent('');
        setPreviewText('');
        setSelectedTitle('');
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      setErrorMessage('Failed to upload. Please try again.');
      console.error('Error uploading:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Open dialog with animation
  const openDialog = () => {
    setIsDialogOpen(true);
    setOverlayAnimation('opacity-0');
    setDialogAnimation('scale-95 opacity-0');

    // Trigger animations after a small delay to ensure DOM elements are ready
    setTimeout(() => {
      setOverlayAnimation('opacity-100');
      setDialogAnimation('scale-100 opacity-100');
    }, 10);
  };

  // Close dialog with animation
  const closeDialog = () => {
    setOverlayAnimation('opacity-0');
    setDialogAnimation('scale-95 opacity-0');

    // Remove dialog from DOM after animation completes
    setTimeout(() => {
      setIsDialogOpen(false);
      setSuccessMessage('');
    }, 200);
  };

  // Toggle between edit and preview modes
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Reset form and states
  const resetForm = () => {
    setUrl('');
    setContent('');
    setErrorMessage('');
    setCharacterCount(0);
  };

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
  }, [isDialogOpen]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-8 flex items-center justify-center'>
      <div className='max-w-3xl w-full mx-auto bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl'>
        {/* Header */}
        <div className='p-6 md:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 hidden md:block'></div>
          <div className='absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2'></div>

          <h1 className='text-2xl md:text-3xl font-bold text-white relative z-10 flex items-center'>
            <Edit3 className='mr-3 h-6 w-6 opacity-80' />
            LinkedIn Content Processor
          </h1>
          <p className='text-blue-100 mt-2 relative z-10 ml-9'>
            Transform your content for LinkedIn with AI assistance
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 md:p-8 space-y-6'>
          {/* Error message */}
          {errorMessage && (
            <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start animate-fadeIn'>
              <AlertCircle className='text-red-500 mr-3 flex-shrink-0 h-5 w-5 mt-0.5' />
              <div className='flex-1'>
                <p className='text-red-700 font-medium'>Error</p>
                <p className='text-red-600 text-sm'>{errorMessage}</p>
              </div>
              <button
                type='button'
                onClick={() => setErrorMessage('')}
                className='text-red-400 hover:text-red-600 transition-colors'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          )}

          {/* Success message */}
          {successMessage && !isDialogOpen && (
            <div className='bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start animate-fadeIn'>
              <Check className='text-green-500 mr-3 flex-shrink-0 h-5 w-5 mt-0.5' />
              <div className='flex-1'>
                <p className='text-green-700 font-medium'>Success</p>
                <p className='text-green-600 text-sm'>{successMessage}</p>
              </div>
              <button
                type='button'
                onClick={() => setSuccessMessage('')}
                className='text-green-400 hover:text-green-600 transition-colors'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          )}

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
              {url && (
                <button
                  type='button'
                  onClick={() => setUrl('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  <X className='h-4 w-4' />
                </button>
              )}
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
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className='animate-spin mr-2 h-5 w-5' />
                  Processing...
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
      </div>

      {/* Preview Dialog */}
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

            {/* Title selection */}
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

              {successMessage && (
                <div className='mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start animate-fadeIn'>
                  <Check className='text-green-500 mr-3 flex-shrink-0 h-5 w-5 mt-0.5' />
                  <p className='text-green-700'>{successMessage}</p>
                </div>
              )}

              {errorMessage && isDialogOpen && (
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
                disabled={isUploading || !selectedTitle}
                className={`flex items-center py-2 px-6 rounded-lg text-white font-medium transition-all ${
                  isUploading || !selectedTitle
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
    </div>
  );
};

export default ContentUploader;
