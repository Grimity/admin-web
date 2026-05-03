export const convertToWebP = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to convert image to WebP'));
            return;
          }
          const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
            type: 'image/webp',
          });
          resolve(webpFile);
        },
        'image/webp',
        0.9
      );
    };
    img.onerror = () => reject(new Error('Image loading failed'));
  });
};
