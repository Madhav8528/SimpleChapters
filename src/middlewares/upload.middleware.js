import multer from 'multer';


const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype !== 'application/json') {
      return cb(new Error('Only JSON files are allowed'), false)
    }
    cb(null, true)
  },
}).single("file");
