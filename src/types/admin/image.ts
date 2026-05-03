export type PresignedImageType = 'profile' | 'feed' | 'background' | 'post' | 'chat';

export interface PresignedUrlRequest {
  type: PresignedImageType;
  ext: 'webp';
  width: number;
  height: number;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  imageName: string;
  imageUrl: string;
}
