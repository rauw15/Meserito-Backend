import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// 1. Configurar la instancia de Cloudinary con tus credenciales
// Asegúrate de que estas variables estén en tu archivo .env y en Render
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configurar el almacenamiento de Cloudinary para Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Esta función determina los parámetros de subida para cada archivo
    return {
      folder: 'meserito-products', // Carpeta en Cloudinary donde se guardarán las imágenes
      allowed_formats: ['jpeg', 'png', 'jpg', 'gif', 'webp'], // Formatos permitidos
      // Opcional: generar un nombre de archivo único para evitar sobreescrituras
      public_id: `product-${Date.now()}` 
    };
  }
});

// 3. Crear y exportar la instancia de Multer configurada
// Esta es la que usarás como middleware en tus rutas
export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Tamaño máximo del archivo: 10MB (puedes ajustarlo)
  },
  fileFilter: (req, file, cb) => {
    // Filtro básico para asegurarse de que es una imagen
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes.'));
    }
  }
});