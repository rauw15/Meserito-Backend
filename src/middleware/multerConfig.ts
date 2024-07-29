import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Configuración del almacenamiento para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Directorio de destino para almacenar las imágenes
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    // Generar un nombre único para el archivo
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Configuración de Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Tamaño máximo del archivo: 5MB
  },
  fileFilter: (req, file, cb) => {
    // Aceptar solo archivos de imagen
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

export default upload;
