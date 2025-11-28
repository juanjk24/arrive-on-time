import crypto from 'crypto';
import { pool } from "../config/db.js";

export class BlockchainModel {
  /**
   * Crea un hash SHA-256 de los datos proporcionados
   */
  static createHash(data) {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  /**
   * Obtiene el último bloque de la cadena
   */
  static async getLatestBlock() {
    try {
      const [blocks] = await pool.query(
        "SELECT * FROM blockchain ORDER BY block_id DESC LIMIT 1"
      );
      return blocks[0] || null;
    } catch (error) {
      console.error("Error al obtener último bloque:", error);
      return null;
    }
  }

  /**
   * Crea el bloque génesis (primer bloque de la cadena)
   */
  static async createGenesisBlock() {
    const genesisData = {
      asistencia_id: 0,
      action: 'GENESIS',
      timestamp: new Date().toISOString(),
      data: { message: 'Bloque Génesis - Inicio del Blockchain de Asistencias' }
    };

    const hash = this.createHash({
      previousHash: '0',
      ...genesisData
    });

    try {
      const [result] = await pool.query(
        `INSERT INTO blockchain 
        (asistencia_id, action, block_data, previous_hash, block_hash, timestamp) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          genesisData.asistencia_id,
          genesisData.action,
          JSON.stringify(genesisData.data),
          '0',
          hash,
          genesisData.timestamp
        ]
      );

      return {
        block_id: result.insertId,
        ...genesisData,
        previous_hash: '0',
        block_hash: hash
      };
    } catch (error) {
      console.error("Error al crear bloque génesis:", error);
      throw error;
    }
  }

  /**
   * Agrega un nuevo bloque a la cadena
   */
  static async addBlock({ asistenciaId, action, data }) {
    try {
      // Obtener el último bloque
      let latestBlock = await this.getLatestBlock();

      // Si no existe la cadena, crear el bloque génesis
      if (!latestBlock) {
        latestBlock = await this.createGenesisBlock();
      }

      // Crear nuevo bloque
      const timestamp = new Date().toISOString();
      const blockData = {
        asistencia_id: asistenciaId,
        action: action,
        timestamp: timestamp,
        data: data
      };

      const hash = this.createHash({
        previousHash: latestBlock.block_hash,
        ...blockData
      });

      // Insertar en la base de datos
      const [result] = await pool.query(
        `INSERT INTO blockchain 
        (asistencia_id, action, block_data, previous_hash, block_hash, timestamp) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          asistenciaId,
          action,
          JSON.stringify(data),
          latestBlock.block_hash,
          hash,
          timestamp
        ]
      );

      return {
        block_id: result.insertId,
        ...blockData,
        previous_hash: latestBlock.block_hash,
        block_hash: hash
      };
    } catch (error) {
      console.error("Error al agregar bloque:", error);
      throw error;
    }
  }

  /**
   * Verifica la integridad de toda la cadena de bloques
   */
  static async verifyChain() {
    try {
      const [blocks] = await pool.query(
        "SELECT * FROM blockchain ORDER BY block_id ASC"
      );

      if (blocks.length === 0) {
        return { valid: true, message: "La cadena está vacía" };
      }

      // Verificar el bloque génesis
      const genesisBlock = blocks[0];
      if (genesisBlock.previous_hash !== '0') {
        return { 
          valid: false, 
          message: "El bloque génesis está comprometido",
          blockId: genesisBlock.block_id 
        };
      }

      // Verificar cada bloque
      for (let i = 0; i < blocks.length; i++) {
        const currentBlock = blocks[i];
        
        // Recalcular el hash del bloque actual
        const blockData = {
          asistencia_id: currentBlock.asistencia_id,
          action: currentBlock.action,
          timestamp: currentBlock.timestamp,
          data: JSON.parse(currentBlock.block_data)
        };

        const calculatedHash = this.createHash({
          previousHash: currentBlock.previous_hash,
          ...blockData
        });

        // Verificar que el hash almacenado coincida con el calculado
        if (calculatedHash !== currentBlock.block_hash) {
          return {
            valid: false,
            message: `El bloque ${currentBlock.block_id} ha sido modificado`,
            blockId: currentBlock.block_id,
            expectedHash: calculatedHash,
            actualHash: currentBlock.block_hash
          };
        }

        // Verificar que el hash anterior coincida (excepto para el primer bloque)
        if (i > 0) {
          const previousBlock = blocks[i - 1];
          if (currentBlock.previous_hash !== previousBlock.block_hash) {
            return {
              valid: false,
              message: `La cadena está rota en el bloque ${currentBlock.block_id}`,
              blockId: currentBlock.block_id
            };
          }
        }
      }

      return { 
        valid: true, 
        message: "La cadena de bloques es válida",
        totalBlocks: blocks.length 
      };
    } catch (error) {
      console.error("Error al verificar la cadena:", error);
      throw error;
    }
  }

  /**
   * Obtiene todos los bloques de la cadena
   */
  static async getAllBlocks() {
    try {
      const [blocks] = await pool.query(
        "SELECT * FROM blockchain ORDER BY block_id ASC"
      );
      return blocks.map(block => ({
        ...block,
        block_data: JSON.parse(block.block_data)
      }));
    } catch (error) {
      console.error("Error al obtener bloques:", error);
      return [];
    }
  }

  /**
   * Obtiene el historial completo de una asistencia específica
   */
  static async getAttendanceHistory(asistenciaId) {
    try {
      const [blocks] = await pool.query(
        "SELECT * FROM blockchain WHERE asistencia_id = ? ORDER BY block_id ASC",
        [asistenciaId]
      );
      return blocks.map(block => ({
        ...block,
        block_data: JSON.parse(block.block_data)
      }));
    } catch (error) {
      console.error("Error al obtener historial de asistencia:", error);
      return [];
    }
  }

  /**
   * Verifica si una asistencia específica existe en el blockchain
   */
  static async verifyAttendanceExists(asistenciaId) {
    try {
      const [blocks] = await pool.query(
        "SELECT * FROM blockchain WHERE asistencia_id = ? AND action = 'CREATE' LIMIT 1",
        [asistenciaId]
      );
      return blocks.length > 0;
    } catch (error) {
      console.error("Error al verificar asistencia:", error);
      return false;
    }
  }

  /**
   * Obtiene estadísticas del blockchain
   */
  static async getStats() {
    try {
      const [totalBlocks] = await pool.query(
        "SELECT COUNT(*) as total FROM blockchain"
      );
      
      const [actionStats] = await pool.query(
        "SELECT action, COUNT(*) as count FROM blockchain GROUP BY action"
      );

      const [firstBlock] = await pool.query(
        "SELECT timestamp FROM blockchain ORDER BY block_id ASC LIMIT 1"
      );

      const [lastBlock] = await pool.query(
        "SELECT timestamp FROM blockchain ORDER BY block_id DESC LIMIT 1"
      );

      return {
        totalBlocks: totalBlocks[0].total,
        actionStats: actionStats,
        firstBlockDate: firstBlock[0]?.timestamp || null,
        lastBlockDate: lastBlock[0]?.timestamp || null
      };
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return null;
    }
  }
}
