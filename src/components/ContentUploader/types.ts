// Define shared types for the ContentUploader components

// Post type enum
export enum PostType {
    WithPhoto = 'photo',
    WithoutPhoto = 'text'
  }
  
  // Form field values
  export interface ContentFormValues {
    url: string;
    content: string;
    selectedFile: File | null;
    previewImage: string | null;
    attachmentName: string;
    selectedTitle?: string;
  }
  
  // API response types
  export interface ProcessContentResponse {
    titles: string[];
    content: string;
  }
  
  // Props for shared components
  export interface StatusMessageProps {
    errorMessage: string;
    successMessage: string;
    setErrorMessage: (message: string) => void;
    setSuccessMessage: (message: string) => void;
  }
  
  export interface FileUploaderProps {
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
    previewImage: string | null;
    setPreviewImage: (image: string | null) => void;
    attachmentName: string;
    setAttachmentName: (name: string) => void;
    originalFileSize: number;
    setOriginalFileSize: (size: number) => void;
    compressedFileSize: number;
    setCompressedFileSize: (size: number) => void;
    isCompressing: boolean;
    setIsCompressing: (compressing: boolean) => void;
    setErrorMessage: (message: string) => void;
  }
  
  export interface PreviewDialogProps {
    isDialogOpen: boolean;
    closeDialog: () => void;
    previewText: string;
    setPreviewText: (text: string) => void;
    url: string;
    handleUpload: () => void;
    isUploading: boolean;
    errorMessage: string;
    successMessage: string;
    setErrorMessage: (message: string) => void;
    postType: PostType;
    titles?: string[];
    selectedTitle?: string;
    setSelectedTitle?: (title: string) => void;
    previewImage: string | null;
    compressedFileSize: number;
    originalFileSize: number;
  }