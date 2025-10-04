import { pool } from "../config/db.js";
import bycrypt from "bcrypt";

export class UserModel {
  // Query para obtener todos los usuarios
  /* static async getAll() {
    try {
      const [users] = await pool.query(
        "SELECT u.*, TIMESTAMPDIFF(YEAR, u.`fecha_nacimiento`, CURDATE()) AS edad, e.nombre_empresa, r.rol_name FROM users u INNER JOIN empresas e ON u.empresa_id = e.empresa_id INNER JOIN user_rol r ON u.rol_id = r.rol_id"
      );
      return users;
    } catch (error) {
      console.log(error);
      return [];
    }
  } */

  /* VUE */

  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  }


  // Query para obtener todos los usuarios administradores
  static async getAdmins() {
    try {
      const [users] = await pool.query("SELECT * FROM users WHERE rol_id = 1");
      return users;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // Query para obtener un usuario por su id
  static async getById({ id }) {
    try {
      const [user] = await pool.query(
        "SELECT u.*, TIMESTAMPDIFF(YEAR, u.`fecha_nacimiento`, CURDATE()) AS edad, e.nombre_empresa, r.rol_name FROM users u INNER JOIN empresas e ON u.empresa_id = e.empresa_id INNER JOIN user_rol r ON u.rol_id = r.rol_id WHERE u.user_id = ?",
        [id]
      );
      return user;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // Query para crear un usuario
  static async create({ input }) {
    try {
      const {
        nombres,
        apellidos,
        fechaNacimiento,
        cedula,
        correo,
        direccion,
        telefono,
        contraseña,
        empresaId,
        rolId,
      } = input;

      const [confirmUser] = await pool.query(
        "SELECT * FROM users WHERE cedula = ? OR correo = ?",
        [cedula, correo]
      );
      if (confirmUser.length > 0) {
        throw new Error("El usuario ya existe con la misma cédula o correo");
      }

      const passwordHash = await bycrypt.hash(contraseña, 10);

      const [result] = await pool.query(
        "INSERT INTO users (nombres, apellidos, fecha_nacimiento, cedula, correo, direccion, telefono, contraseña, empresa_id, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          nombres,
          apellidos,
          fechaNacimiento,
          cedula,
          correo,
          direccion,
          telefono,
          passwordHash,
          empresaId,
          rolId,
        ]
      );

      const { contraseña: _, ...user } = input;
      return {
        message: "Usuario creado correctamente",
        id: result.insertId,
        user,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  // Metodo para subir la imagen de perfil de un usuario
  static async setImageProfile({ id, imageUrl }) {
    try {
      const [result] = await pool.query(
        "UPDATE users SET user_img_profile = ? WHERE user_id = ?",
        [imageUrl, id]
      );

      return result.affectedRows;
    } catch (error) {
      console.error(error);
      throw new Error("Error al establecer la imagen de perfil del usuario");
    }
  }

  // Metodo para subir la imagen de perfil de un usuario a la base de datos en formato blob
  static async setImageProfileDB({ id, imageData, imagePath }) {
    try {
      const [result] = await pool.query(
        "UPDATE users SET user_img_profile_blob = ?, user_img_profile_path = ? WHERE user_id = ?",
        [imageData, imagePath, id]
      );

      return result.affectedRows;
    } catch (error) {
      console.error(error);
      throw new Error("Error al establecer la imagen de perfil del usuario");
    }
  }

  // Query para actualizar un usuario
  static async update({ id, input }) {
    try {
      const {
        nombres,
        apellidos,
        fechaNacimiento,
        cedula,
        correo,
        direccion,
        telefono,
        empresaId,
        rolId,
      } = input;

      const [result] = await pool.query(
        "UPDATE users SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, cedula = ?, correo = ?, direccion = ?, telefono = ?, empresa_id = ?, rol_id = ? WHERE user_id = ?",
        [
          nombres,
          apellidos,
          fechaNacimiento,
          cedula,
          correo,
          direccion,
          telefono,
          empresaId,
          rolId,
          id,
        ]
      );

      return result.affectedRows;
    } catch (error) {
      console.log(error);
      throw new Error("Error al actualizar el usuario");
    }
  }

  // Query para eliminar un usuario
  static async delete({ id }) {
    try {
      const [result] = await pool.query("DELETE FROM users WHERE user_id = ?", [
        id,
      ]);
      return result.affectedRows;
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el usuario");
    }
  }

  // Iniciar sesion con cedula y contraseña
  static async getByCC({ cedula, contraseña }) {
    if (!cedula || !contraseña) {
      throw new Error("Usuario y contraseña son requeridos");
    }

    const [user] = await pool.query("SELECT * FROM users WHERE cedula = ?", [
      cedula,
    ]);
    if (user.length === 0) throw new Error("Usuario no encontrado");

    const isValidPassword = await bycrypt.compare(
      contraseña,
      user[0].contraseña
    );
    if (!isValidPassword) throw new Error("Contraseña incorrecta");

    const { contraseña: _, ...publicUser } = user[0];

    return publicUser;
  }

  // Iniciar sesion con google
  static async getByEmail({ email }) {
    try {
      if (!email) {
        throw new Error("No se logro iniciar sesion con google");
      }

      const [user] = await pool.query("SELECT * FROM users WHERE correo = ?", [
        email,
      ]);
      if (user.length === 0) throw new Error("Usuario no encontrado. El acceso con Google no esta habilitado para este usuario");

      const { contraseña: _, ...publicUser } = user[0];

      return publicUser;
    } catch (error) {
      throw new Error(error);
    }

  }
}
