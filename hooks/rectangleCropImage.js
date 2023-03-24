import { useState } from "react";

const useImageCrop = ({ defCrop }) => {
  const [crop, setCrop] = useState(defCrop);
  const [imageRef, setImageRef] = useState();
  const [croppedImage, setCroppedImage] = useState(null);

  const onImageLoaded = (image) => {
    setImageRef(image);
    // Center a square percent crop.
    const width = 100;
    const height = (image.width / 3 / image.height) * 100;
    const x = 0;
    const y = (100 - height) / 3;
    setCrop({ ...crop, width, height, x, y });
    return false;
  };
  const onCropChange = (crop, percentCrop) => {
    setCrop(percentCrop);
  };
  const onCropComplete = () => {
    makeCrop(crop);
    setCrop(defCrop);
  };

  const makeCrop = async (crop) => {
    if (imageRef && crop.width && crop.height) {
      let croppedImage = await getCroppedImg(imageRef, crop);
      setCroppedImage(croppedImage);
    }
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const cropPxWidth = (crop.width * image.width) / 100;
    const cropPxHeight = (crop.height * image.height) / 100;
    const cropPxX = (crop.x * image.width) / 100;
    const cropPxY = (crop.y * image.height) / 100;
    canvas.width = cropPxWidth;
    canvas.height = cropPxHeight;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      cropPxX * scaleX,
      cropPxY * scaleY,
      cropPxWidth * scaleX,
      cropPxHeight * scaleY,
      0,
      0,
      cropPxWidth,
      cropPxHeight
    );

    // As Base64 string
    const base64Image = canvas.toDataURL("image/jpeg");

    return base64Image;
  };

  return {
    crop,
    croppedImage,
    onImageLoaded,
    onCropChange,
    onCropComplete,
  };
};
export default useImageCrop;
