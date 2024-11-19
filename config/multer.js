const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');
const { v4: uuidv4 } = require('uuid');  // Import UUID library for unique IDs

// Configure CloudinaryStorage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'drive_files', // Cloudinary folder to store images
    format: async (req, file) => {
      // Choose the format based on the file's mimetype or set a default format
      const mimeType = file.mimetype;
      if (mimeType === 'application/pdf') return 'pdf';
      else if (mimeType === 'image/jpeg') return 'jpg';
      else if (mimeType === 'image/png') return 'png';
      // Default to original format if unspecified
      return mimeType.split('/')[1];
    },
    public_id: (req, file) => `${uuidv4()}-${file.originalname}-${uuidv4()}`, // Optional - use original name
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
