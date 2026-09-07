export async function uploadFiles(filesList: FileList | File[]): Promise<string[]> {
  const files = Array.from(filesList).filter(Boolean);
  if (files.length === 0) return [];

  // 1. Try server endpoint /api/upload first
  try {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.urls) && data.urls.length > 0) {
        return data.urls;
      }
    }
  } catch (err) {
    console.warn('Server upload failed, falling back to client-side conversion:', err);
  }

  // 2. Client-side Base64 Data URL fallback with canvas compression if needed
  const processFileClientSide = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!result) return resolve('');

        // If file is small (< 1MB), return data URL directly
        if (file.size < 1024 * 1024) {
          return resolve(result);
        }

        // Compress large image using Canvas
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(result);

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressedDataUrl);
        };
        img.onerror = () => resolve(result);
        img.src = result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const results = await Promise.all(files.map(processFileClientSide));
  return results.filter(Boolean);
}
