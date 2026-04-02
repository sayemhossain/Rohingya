import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function ensureConfig() {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    configured = true;
  }
}

export default cloudinary;

export async function uploadImage(
  fileOrBase64: string
): Promise<{ secure_url: string; public_id: string }> {
  ensureConfig();
  const result = await cloudinary.uploader.upload(fileOrBase64, {
    folder: 'arohi',
    resource_type: 'image',
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
}
