export const getBase64 = (img, callback, maxWidth = 800, maxHeight = 800) => {
  const reader = new FileReader();
  reader.onload = () => {
    const imgElement = new Image();
    imgElement.src = reader.result as string;
    imgElement.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = imgElement.width;
      let height = imgElement.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height *= maxWidth / width));
          width = maxWidth;
        } else {
          width = Math.round((width *= maxHeight / height));
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(imgElement, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL("image/webp", 0.5); // Adjust the quality as needed
      callback(compressedBase64);
    };
  };
  reader.readAsDataURL(img);
};
