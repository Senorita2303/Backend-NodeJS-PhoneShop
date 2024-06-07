const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require('path');
import { env } from '~/config/environment';
cloudinary.config({
    cloud_name: env.CLOUDINARY_NAME,
    api_key: env.API_KEY,
    api_secret: env.API_SECRET,
});
function uploadMiddleware(folderName) {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: (req, file) => {
            const folderPath = `${folderName.trim()}`; // Update the folder path here
            const fileExtension = path.extname(file.originalname).substring(1);
            const publicId = `${file.fieldname}-${Date.now()}`;

            return {
                folder: folderPath,
                public_id: publicId,
                format: fileExtension,
            };
        },
    });

    return multer({
        storage: storage,
        limits: {
            fileSize: 10 * 1024 * 1024, // keep images size < 5 MB
        },
    });
}

module.exports = uploadMiddleware;

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     allowedFormats: ["jpg", "png", "jpeg"],
//     params: {
//         folder: "Avatar",
//     },
// });

// const uploadCloud = multer({ storage: storage });

// module.exports = uploadCloud;