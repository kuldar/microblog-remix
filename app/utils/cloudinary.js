import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary
export async function uploadAvatar(fileStream) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "avatar", upload_preset: "avatar" },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
    fileStream.pipe(uploadStream);
  });
}

export async function uploadCover(fileStream) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "cover", upload_preset: "cover" },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
    fileStream.pipe(uploadStream);
  });
}
