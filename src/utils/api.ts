/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { API_URL, CATEGORIES } from './constants';
import { ProcessContentResponse } from '../components/ContentUploader/types';

/**
 * Process content to generate LinkedIn post suggestions
 * @param url The URL to process
 * @param content The content to process
 * @param attachment Optional file attachment
 * @returns Promise with response data
 */
export const processContent = async (
  url: string,
  content: string,
  attachment: File | null
): Promise<ProcessContentResponse> => {
  try {
    if (attachment) {
      const formData = new FormData();
      formData.append('category', CATEGORIES.PROCESS_CONTENT.toString());
      formData.append('url', url);
      formData.append('content', content);
      formData.append('attachment', attachment);

      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      });

      return response.data;
    } else {
      const response = await axios.post(
        API_URL,
        {
          category: CATEGORIES.PROCESS_CONTENT,
          url,
          content,
        },
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      return response.data;
    }
  } catch (error: any) {
    // Extract error message
    let errorMsg = 'Failed to process content. Please try again.';

    if (error.response) {
      if (error.response.status === 413) {
        errorMsg = 'File size too large. Please try a smaller file or reduce image quality.';
      } else if (error.response.data && error.response.data.message) {
        errorMsg = `Server error: ${error.response.data.message}`;
      }
    } else if (error.request) {
      errorMsg = 'No response from server. Please check your connection and try again.';
    }

    throw new Error(errorMsg);
  }
};

/**
 * Upload content to LinkedIn
 * @param url The URL to include in the post
 * @param post The post content
 * @param selectedTitle Optional selected title
 * @param attachment Optional file attachment
 * @returns Promise with response data
 */
export const uploadToLinkedIn = async (
  url: string,
  post: string,
  selectedTitle: string | undefined,
  attachment: File | null
): Promise<any> => {
  try {
    // Create FormData for the upload
    const formData = new FormData();
    
    formData.append('post', post);
    formData.append('url', url);
    
    // Include the title if provided
    if (selectedTitle) {
      formData.append('selectedTitle', selectedTitle);
    }

    // Include the file if it exists
      if (attachment) {
        formData.append('category', CATEGORIES.UPLOAD_TO_LINKEDIN_WITH_IMAGE.toString())
      formData.append('attachment', attachment);
      } else {
        formData.append('category', CATEGORIES.UPLOAD_TO_LINKEDIN.toString())
    }

    // Send the request with FormData
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 seconds timeout
    });

    return response.data;
  } catch (error: any) {
    // Enhanced error handling
    let errorMsg = 'Failed to upload. Please try again.';

    if (error.response) {
      if (error.response.status === 413) {
        errorMsg = 'File size too large for LinkedIn. Please try a smaller file.';
      } else if (error.response.data && error.response.data.message) {
        errorMsg = `LinkedIn upload error: ${error.response.data.message}`;
      }
    } else if (error.request) {
      errorMsg = 'No response from server. Please check your connection and try again.';
    }

    throw new Error(errorMsg);
  }
};