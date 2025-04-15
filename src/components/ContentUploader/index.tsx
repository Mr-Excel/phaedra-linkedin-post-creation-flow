import React, { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { PostType } from './types';
import PostWithPhoto from './PostWithPhoto';
import PostWithoutPhoto from './PostWithoutPhoto';

const ContentUploader: React.FC = () => {
  // State for managing which post type is selected
  const [postType, setPostType] = useState<PostType>(PostType.WithoutPhoto);

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

        {/* Post Type Selection Tabs */}
        <div className='flex border-b border-gray-200'>
          <button
            onClick={() => setPostType(PostType.WithoutPhoto)}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
              postType === PostType.WithoutPhoto
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Text Post
          </button>
          <button
            onClick={() => setPostType(PostType.WithPhoto)}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
              postType === PostType.WithPhoto
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Photo Post
          </button>
        </div>

        {/* Content Container */}
        <div className='p-6 md:p-8'>
          {postType === PostType.WithPhoto ? (
            <PostWithPhoto />
          ) : (
            <PostWithoutPhoto />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentUploader;
