import { BlockchainModel } from "../models/blockchain.js";

export class BlockchainController {
  /**
   * Verifica la integridad de toda la cadena de bloques
   */
  static async verifyChain(req, res) {
    try {
      const result = await BlockchainModel.verifyChain();
      
      if (result.valid) {
        res.json({
          success: true,
          ...result
        });
      } else {
        res.status(400).json({
          success: false,
          ...result
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false,
        message: "Error al verificar la cadena de bloques" 
      });
    }
  }

  /**
   * Obtiene todos los bloques de la cadena
   */
  static async getAllBlocks(req, res) {
    try {
      const blocks = await BlockchainModel.getAllBlocks();
      res.json({
        success: true,
        totalBlocks: blocks.length,
        blocks
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false,
        message: "Error al obtener los bloques" 
      });
    }
  }

  /**
   * Obtiene el historial de una asistencia específica
   */
  static async getAttendanceHistory(req, res) {
    const { id } = req.params;

    try {
      const history = await BlockchainModel.getAttendanceHistory(id);
      
      if (history.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No se encontró historial para esta asistencia"
        });
      }

      res.json({
        success: true,
        asistenciaId: id,
        totalRecords: history.length,
        history
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false,
        message: "Error al obtener el historial de la asistencia" 
      });
    }
  }

  /**
   * Verifica si una asistencia existe en el blockchain
   */
  static async verifyAttendance(req, res) {
    const { id } = req.params;

    try {
      const exists = await BlockchainModel.verifyAttendanceExists(id);
      
      if (exists) {
        // Verificar también la integridad de la cadena
        const chainVerification = await BlockchainModel.verifyChain();
        
        res.json({
          success: true,
          exists: true,
          message: "La asistencia existe en el blockchain",
          chainIntegrity: chainVerification
        });
      } else {
        res.status(404).json({
          success: false,
          exists: false,
          message: "La asistencia no existe en el blockchain"
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false,
        message: "Error al verificar la asistencia" 
      });
    }
  }

  /**
   * Obtiene estadísticas del blockchain
   */
  static async getStats(req, res) {
    try {
      const stats = await BlockchainModel.getStats();
      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false,
        message: "Error al obtener estadísticas del blockchain" 
      });
    }
  }

  /**
   * Inicializa el blockchain creando el bloque génesis
   */
  static async initialize(req, res) {
    try {
      const latestBlock = await BlockchainModel.getLatestBlock();
      
      if (latestBlock) {
        return res.status(400).json({
          success: false,
          message: "El blockchain ya está inicializado"
        });
      }

      const genesisBlock = await BlockchainModel.createGenesisBlock();
      
      res.status(201).json({
        success: true,
        message: "Blockchain inicializado correctamente",
        genesisBlock
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false,
        message: "Error al inicializar el blockchain" 
      });
    }
  }
}
