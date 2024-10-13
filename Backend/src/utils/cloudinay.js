import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const destroyCloudImage = async (localFilePath) => {
  try {

    await cloudinary.uploader.destroy(localFilePath)     
    return true

  } catch (error) {
     console.error('Error deleting video:', error);
  }
}


const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath.path, {
      resource_type: "auto",
      folder: 'videoweb',
      width: 150,
      crop: "scale",
    });

    fs.unlinkSync(localFilePath.path);
    return response;

  } 
  catch (error) {
    console.error("Error uploading to Cloudinary", error);
    fs.unlinkSync(localFilePath.path);
    return null;
  }
};


const uploadPDFOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath.path, {
      resource_type: "raw",
      // folder: 'videoweb',
    });

    fs.unlinkSync(localFilePath.path);
    return response;

  } 
  catch (error) {
    console.error("Error uploading to Cloudinary", error);
    fs.unlinkSync(localFilePath.path);
    return null;
  }
};


export { uploadOnCloudinary, destroyCloudImage, uploadPDFOnCloudinary }