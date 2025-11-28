import { Router } from "express";
import { BlockchainController } from "../controllers/blockchain.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// Verificar la integridad de la cadena
router.get("/verify", verifyToken, BlockchainController.verifyChain);

// Obtener todos los bloques
router.get("/blocks", verifyToken, BlockchainController.getAllBlocks);

// Obtener historial de una asistencia específica
router.get("/attendance/:id/history", verifyToken, BlockchainController.getAttendanceHistory);

// Verificar si una asistencia existe en el blockchain
router.get("/attendance/:id/verify", verifyToken, BlockchainController.verifyAttendance);

// Obtener estadísticas del blockchain
router.get("/stats", verifyToken, BlockchainController.getStats);

// Inicializar el blockchain (solo usar una vez)
router.post("/initialize", verifyToken, BlockchainController.initialize);

export default router;
