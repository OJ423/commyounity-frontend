import { uploadFile } from "./apiCalls";
import imageCompression from "browser-image-compression";

export async function handleUpload (file: File | null, token: string | null, oldImg: string | undefined)  {
  if (!file) return;

  try {

    const imgOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 500,
      useWebWorker: true,
    }

    const compressedImg = await imageCompression(file, imgOptions)
  
    const formData = new FormData();
    formData.append('image', compressedImg);

    if (oldImg) {
      if (oldImg.includes('comyounity-image-storage.s3.')) {
        formData.append('oldImg', oldImg)
      }
    }
  
    const response = await uploadFile(formData, token)
    return response.imgUrl;;
  } catch (error:any) {
    console.error('Error uploading or compressing file:', error);
  }
};