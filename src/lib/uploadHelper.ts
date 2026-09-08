export async function uploadFiles(filesList: FileList | File[]): Promise<string[]> {
  const rawFiles = Array.from(filesList).filter(Boolean);
  if (rawFiles.length === 0) return [];

  // Helper function to compress images client-side before upload
  const compressImage = async (file: File): Promise<{ file: File; dataUrl: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawResult = e.target?.result as string;
        if (!rawResult) return resolve({ file, dataUrl: '' });

        const img = new Image();
        let timeoutId: ReturnType<typeof setTimeout> | null = setTimeout(() => {
          timeoutId = null;
          console.warn('Image compression timed out, returning fallback URL');
          resolve({ file, dataUrl: rawResult.length < 500000 ? rawResult : '' });
        }, 15000);

        img.onload = () => {
          if (!timeoutId) return;
          clearTimeout(timeoutId);

          try {
            const maxDim = 450;
            let width = img.width || 450;
            let height = img.height || 450;

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
            if (!ctx) {
              return resolve({ file, dataUrl: rawResult.length < 500000 ? rawResult : '' });
            }

            ctx.drawImage(img, 0, 0, width, height);
            let compressedDataUrl = canvas.toDataURL('image/jpeg', 0.45);

            if (compressedDataUrl.length > 120000) {
              canvas.width = Math.round(width * 0.7);
              canvas.height = Math.round(height * 0.7);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              compressedDataUrl = canvas.toDataURL('image/jpeg', 0.35);
            }

            const arr = compressedDataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], { type: mime });
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', { type: mime });
            resolve({ file: compressedFile, dataUrl: compressedDataUrl });
          } catch (err) {
            console.warn('Canvas compression error:', err);
            resolve({ file, dataUrl: rawResult.length < 500000 ? rawResult : '' });
          }
        };

        img.onerror = () => {
          if (timeoutId) clearTimeout(timeoutId);
          resolve({ file, dataUrl: rawResult.length < 500000 ? rawResult : '' });
        };

        img.src = rawResult;
      };

      reader.onerror = () => resolve({ file, dataUrl: '' });
      reader.readAsDataURL(file);
    });
  };

  const processed = await Promise.all(rawFiles.map(compressImage));

  // 1. Try server endpoint /api/upload with compressed files
  try {
    const formData = new FormData();
    processed.forEach((p) => formData.append('files', p.file));

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
    console.warn('Server upload error, using compressed Base64 data URLs:', err);
  }

  // 2. Client-side Base64 fallback if server upload fails
  return processed.map((p) => p.dataUrl).filter(Boolean);
}
