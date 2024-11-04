import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import streamifier from 'streamifier';


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


const uploadOnCloudinary = async (file) => {
  try {
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ 
        resource_type: "auto", 
        folder: 'videoweb', 
        width: 150, 
        crop: "scale" 
      },
      (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
         }
       );
       streamifier.createReadStream(file.buffer).pipe(uploadStream);
     });
   } 
    catch (error) {
     console.error("Error uploading file to Cloudinary:", error);
     throw new Error("Failed to upload image to Cloudinary");
  }
};



const uploadPDFOnCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw' },
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};


// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath || !localFilePath.path) {
//       throw new Error("Invalid localFilePath or localFilePath path provided for upload.");
//     }

//     const response = await cloudinary.uploader.upload(localFilePath.path, {
//       resource_type: "auto",
//       folder: 'videoweb',
//       width: 150,
//       crop: "scale",
//     }); 

//     if (fs.existsSync(localFilePath.path)) {
//       fs.unlinkSync(localFilePath.path);
//     }
//     return response;
//   } 
//   catch (error) {
//     console.error("Error uploading to Cloudinary", error);
    
//     if (localFilePath && localFilePath.path && fs.existsSync(localFilePath.path)) {
//       fs.unlinkSync(localFilePath.path);
//     }
//     return null;
//   }
// };




// const uploadPDFOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath.path) return null;

//     const response = await cloudinary.uploader.upload(localFilePath.path, {
//       resource_type: "raw",
//       // folder: 'videoweb',
//     });

//     fs.unlinkSync(localFilePath.path);
//     return response;

//   } 
//   catch (error) {
//     console.error("Error uploading to Cloudinary", error);
//     fs.unlinkSync(localFilePath.path);
//     return null;
//   }
// };


export { uploadOnCloudinary, destroyCloudImage, uploadPDFOnCloudinary }