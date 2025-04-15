import React from 'react';
import { AlertCircle, Check, X } from 'lucide-react';
import { StatusMessageProps } from './types';

const StatusMessages: React.FC<StatusMessageProps> = ({
  errorMessage,
  successMessage,
  setErrorMessage,
  setSuccessMessage,
}) => {
  return (
    <>
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
      {successMessage && (
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
    </>
  );
};

export default StatusMessages;
