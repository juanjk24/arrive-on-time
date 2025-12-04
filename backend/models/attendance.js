import { pool } from "../config/db.js";
import { BlockchainModel } from "./blockchain.js";

export class AttendanceModel {
  // Query para obtener todos las asistencias
  static async getAll() {
    try {
      const [attendances] = await pool.query(
        "SELECT a.asistencia_id, a.fecha, a.hora, a.tipo_id, a.user_id, u.nombres, u.apellidos, u.cedula, e.nombre_empresa, t.tipo_asistencia FROM asistencia a JOIN users u ON a.user_id = u.user_id JOIN empresas e ON u.empresa_id = e.empresa_id JOIN tipo_asistencia t ON a.tipo_id = t.tipo_id ORDER BY a.asistencia_id DESC"
      );
      return attendances;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // Query para obtener una asistencia por su id
  static async getById({ id }) {
    try {
      const [attendance] = await pool.query(
        "SELECT a.asistencia_id, a.fecha, a.hora, a.tipo_id, a.user_id, u.nombres, u.apellidos, u.cedula, e.nombre_empresa, t.tipo_asistencia FROM asistencia a JOIN users u ON a.user_id = u.user_id JOIN empresas e ON u.empresa_id = e.empresa_id JOIN tipo_asistencia t ON a.tipo_id = t.tipo_id WHERE a.asistencia_id = ?",
        [id]
      );
      return attendance;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // Query para obtener todas las asistencias de un usuario
  static async getByUserId({ userId }) {
    try {
      const [attendances] = await pool.query(
        "SELECT a.fecha, a.hora, a.user_id, a.tipo_id, u.nombres, u.apellidos, u.cedula, e.nombre_empresa, t.tipo_asistencia FROM asistencia a JOIN users u ON a.user_id = u.user_id JOIN empresas e ON u.empresa_id = e.empresa_id JOIN tipo_asistencia t ON a.tipo_id = t.tipo_id WHERE a.user_id = ? ORDER BY a.asistencia_id DESC",
        [userId]
      );
      return attendances;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // Query para crear un tipo de asistencia
  static async create({ input }) {
    const { date, time, attendanceTypeId, userId } = input;

    try {
      const [result] = await pool.query(
        "INSERT INTO asistencia (fecha, hora, tipo_id, user_id) VALUES (?, ?, ?, ?)",
        [date, time, attendanceTypeId, userId]
      );

      const attendanceId = result.insertId;

      // Agregar al blockchain
      try {
        await BlockchainModel.addBlock({
          asistenciaId: attendanceId,
          action: 'CREATE',
          data: {
            fecha: date,
            hora: time,
            tipo_id: attendanceTypeId,
            user_id: userId
          }
        });
      } catch (blockchainError) {
        console.error("Error al agregar al blockchain:", blockchainError);
        // No fallar la creación de asistencia si el blockchain falla
      }

      return { id: attendanceId, input };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  // Query para actualizar una asistencia
  static async update({ id, input }) {
    const { date, time, attendanceTypeId, userId } = input;

    try {
      // Obtener datos anteriores antes de actualizar
      const [previousData] = await pool.query(
        "SELECT * FROM asistencia WHERE asistencia_id = ?",
        [id]
      );

      const [result] = await pool.query(
        "UPDATE asistencia SET fecha = ?, hora = ?, tipo_id = ?, user_id = ? WHERE asistencia_id = ?",
        [date, time, attendanceTypeId, userId, id]
      );

      // Agregar al blockchain
      try {
        await BlockchainModel.addBlock({
          asistenciaId: id,
          action: 'UPDATE',
          data: {
            previous: previousData[0] || null,
            new: {
              fecha: date,
              hora: time,
              tipo_id: attendanceTypeId,
              user_id: userId
            }
          }
        });
      } catch (blockchainError) {
        console.error("Error al agregar al blockchain:", blockchainError);
      }

      return { affectedRows: result.affectedRows, id: previousData[0].asistencia_id };
    } catch (error) {
      console.log(error);
      throw new Error("Error al actualizar la asistencia");
    }
  }

  // Query para eliminar una asistencia
  static async delete({ id }) {
    try {
      // Obtener datos antes de eliminar
      const [attendanceData] = await pool.query(
        "SELECT * FROM asistencia WHERE asistencia_id = ?",
        [id]
      );

      // IMPORTANTE: No eliminamos realmente, solo marcamos como eliminada en blockchain
      // pero mantenemos el registro en la tabla principal
      const [result] = await pool.query(
        "DELETE FROM asistencia WHERE asistencia_id = ?",
        [id]
      );

      // Agregar al blockchain el intento de eliminación
      try {
        await BlockchainModel.addBlock({
          asistenciaId: id,
          action: 'DELETE',
          data: {
            deleted_data: attendanceData[0] || null,
            warning: 'Esta asistencia fue eliminada de la base de datos pero permanece en el blockchain'
          }
        });
      } catch (blockchainError) {
        console.error("Error al agregar al blockchain:", blockchainError);
      }

      return result.affectedRows;
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar la asistencia");
    }
  }
}