import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { UserModel } from "../models/user.js";
import { validateUser, validateUserUpdate } from "../schemas/users.js";
import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "../config/cloudinary.js";
import { encryptImage, decryptImage } from "../utils/encrypt-image.js";

cloudinary.config(cloudinaryConfig);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class UserController {
  // Método para obtener todos los usuarios
  static async getAll(req, res) {
    try {
      const users = await UserModel.getAll();

      const publicUsers = users.map((user) => {
        const { contraseña: _, ...publicUser } = user;
        return publicUser;
      });

      res.json(publicUsers);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener los usuarios" });
    }
  }

  // Método para obtener todos los usuarios administradores
  static async getAdmins(req, res) {
    try {
      const users = await UserModel.getAdmins();

      const publicUsers = users.map((user) => {
        const { contraseña: _, ...publicUser } = user;
        return publicUser;
      });

      res.json(publicUsers);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error al obtener los usuarios administradores" });
    }
  }

  // Método para obtener un usuario por su id
  static async getById(req, res) {
    const { id } = req.params;

    try {
      const user = await UserModel.getById({ id });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el usuario" });
    }
  }

  // Método para crear un usuario siendo administrador
  static async create(req, res) {
    const result = validateUser(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    try {
      const user = await UserModel.create({ input: result.data });
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // Método para establecer la imagen de perfil de un usuario
  static async setImageProfile(req, res) {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No se ha subido ningun archivo" });

      const { size } = req.file;
      if (size > 1024 * 1024)
        return res.status(400).json({ message: "La imagen debe pesar menos de 1MB" });

      const { mimetype } = req.file;
      if (!mimetype.startsWith("image") || !["image/jpeg", "image/png"].includes(mimetype)) {
        return res.status(400).json({ message: "Tipo de archivo no valido" });
      }

      const { id } = req.params;
      const { buffer } = req.file;

      // Subir la imagen a cloudinary
      const response = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "arrive_on_time",
            },
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          )
          .end(buffer);
      });

      const result = await UserModel.setImageProfile({
        id,
        imageUrl: response.url,
      });
      res.json({ message: "Imagen subida con éxito", affectedRows: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al subir la imagen" });
    }
  }

  // Metodo para guardar la imagen de perfil en la base de datos
  static async setImageProfileDB(req, res) {
    try {
      if (!req.file) return res.status(400).json({ message: "No se ha subido ningún archivo" });

      const { size, mimetype, buffer, originalname } = req.file;

      if (size > 1024 * 1024) return res.status(400).json({ message: "La imagen debe pesar menos de 1MB" });

      if (!mimetype.startsWith("image") || !["image/jpeg", "image/png"].includes(mimetype)) {
        return res.status(400).json({ message: "Tipo de archivo no válido" });
      }

      const { id } = req.params;

      // Encriptar la imagen
      const encryptedData = encryptImage(buffer);

      // Guardar la imagen en el servidor
      const uploadDir = path.join(__dirname, "..", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      // Ruta y nombre del archivo
      const fileName = `profile_${id}_${Date.now()}_${originalname}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, encryptedData);

      // Guardar en la base de datos
      const result = await UserModel.setImageProfileDB({
        id,
        imageData: encryptedData,
        imagePath: `uploads/${fileName}`,
      });

      res.json({ message: "Imagen subida con éxito", affectedRows: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al subir la imagen" });
    }
  }

  // Método para obtener la imagen de perfil de un usuario
  static async getImageProfile(req, res) {
    const { id } = req.params;

    try {
      const [user] = await UserModel.getById({ id });

      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      if (!user.user_img_profile_path) return res.status(404).json({ message: "Usuario sin imagen de perfil" });

      // **Ruta de la imagen en el servidor**
      const imagePath = path.join(__dirname, "..", user.user_img_profile_path);

      // Leer la imagen encriptada
      const encryptedData = await fs.readFile(imagePath);

      // Extraer el IV y los datos encriptados
      const iv = encryptedData.slice(0, 16);
      const encryptedBuffer = encryptedData.slice(16);

      // Desencriptar la imagen
      const decryptedData = decryptImage(encryptedBuffer, iv);

      // Enviar la imagen desencriptada
      res.setHeader("Content-Type", "image/jpeg");
      res.send(decryptedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener la imagen" });
    }
  }

  // Método para actualizar un usuario siendo administrador
  static async update(req, res) {
    const { id } = req.params;
    const result = validateUserUpdate(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    try {
      const [userFound] = await UserModel.getById({ id });
      if (!userFound) return res.status(404).json({ message: "Usuario para actualizar no encontrado" });

      const resultUser = await UserModel.update({ id, input: result.data });
      res.status(201).json({
        message: "Usuario actualizado correctamente",
        affectedRows: resultUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  // Método para eliminar un usuario siendo administrador
  static async delete(req, res) {
    const { id } = req.params;

    try {
      const [userFound] = await UserModel.getById({ id });
      if (!userFound) return res.status(404).json({ message: "Usuario para eliminar no encontrado" });

      const result = await UserModel.delete({ id });
      res.json({
        message: "Usuario eliminado correctamente",
        affectedRows: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el usuario" });
    }
  }


  // 🔓 Método público para obtener usuarios sin autenticación
static async getAllPublic(req, res) {
  try {
    const users = await UserModel.getAll();

    const publicUsers = users.map(({ contraseña, ...rest }) => rest);

    res.json(publicUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios públicos" });
  }
}
}

export async function getAllPublic(req, res) {
  try {
    const users = await UserModel.getAll();
    const publicUsers = users.map(({ contraseña, ...rest }) => rest);
    res.json(publicUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios públicos" });
  }

}