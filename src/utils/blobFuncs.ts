import { uploadFile } from "./apiCalls";

export async function handleUpload (file: File | null, token: string | null, oldImg: string | undefined)  {
  if (!file) return;
  
  const formData = new FormData();
  formData.append('image', file);

  if (oldImg) {
    if (oldImg.includes('comyounity-image-storage.s3.')) {
      formData.append('oldImg', oldImg)
    }
  }
  
  try {
    const response = await uploadFile(formData, token)
    return response.imgUrl;;
  } catch (error:any) {
    console.error('Error uploading file:', error);
  }
};