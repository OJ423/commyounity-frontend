import { uploadFile } from "./apiCalls";

export async function handleUpload (file: File | null, token: string | null)  {
  if (!file) return;
  
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await uploadFile(file, token)
    return response.imgUrl;;
  } catch (error:any) {
    console.error('Error uploading file:', error);
  }
};