import { postPresignedUrl } from '@/api/images/postPresignedUrl';
import { convertToWebP } from '@/utils/convertToWebP';
import { getImageDimensions } from '@/utils/getImageDimensions';

interface BlobInfo {
  blob: () => Blob;
  filename: () => string;
}

export const useEditorImageUploader = () => {
  const uploadImage = async (blobInfo: BlobInfo): Promise<string> => {
    const blob = blobInfo.blob();
    const filename = blobInfo.filename();
    const file = new File([blob], filename, { type: blob.type });

    const webpFile = await convertToWebP(file);
    const { width, height } = await getImageDimensions(webpFile);

    const { uploadUrl, imageUrl } = await postPresignedUrl({
      type: 'post',
      ext: 'webp',
      width,
      height,
    });

    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      body: webpFile,
      headers: { 'Content-Type': 'image/webp' },
    });

    if (!uploadRes.ok) {
      throw new Error('이미지 업로드에 실패했습니다.');
    }

    return imageUrl;
  };

  return { uploadImage };
};
