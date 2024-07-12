const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Airbnb', // Change this folder name as needed
        allowed_formats: ['jpeg', 'png', 'jpg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // Example transformation
    }
});

// Export the configured storage and cloudinary instance
module.exports = {
    cloudinary,
    storage
};
