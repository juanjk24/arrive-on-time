
CREATE TABLE IF NOT EXISTS `blockchain` (
  `block_id` int NOT NULL AUTO_INCREMENT,
  `asistencia_id` int NOT NULL,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Tipo de acción: CREATE, UPDATE, DELETE, GENESIS',
  `block_data` JSON NOT NULL COMMENT 'Datos del registro en formato JSON',
  `previous_hash` varchar(64) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Hash del bloque anterior',
  `block_hash` varchar(64) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Hash único de este bloque',
  `timestamp` varchar(100) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Fecha y hora de creación del bloque',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp automático de MySQL',
  PRIMARY KEY (`block_id`),
  INDEX `idx_asistencia_id` (`asistencia_id`),
  INDEX `idx_action` (`action`),
  INDEX `idx_block_hash` (`block_hash`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Blockchain para auditoría inmutable de asistencias';


DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS InitializeBlockchain()
BEGIN
  DECLARE block_count INT;
  
  SELECT COUNT(*) INTO block_count FROM blockchain;
  
  IF block_count = 0 THEN
    -- Crear el bloque génesis
    INSERT INTO blockchain 
    (asistencia_id, action, block_data, previous_hash, block_hash, timestamp)
    VALUES (
      0,
      'GENESIS',
      JSON_OBJECT('message', 'Bloque Génesis - Inicio del Blockchain de Asistencias', 'version', '1.0'),
      '0',
      SHA2(CONCAT('0', '0', 'GENESIS', NOW()), 256),
      NOW()
    );
  END IF;
END$$

DELIMITER ;

CALL InitializeBlockchain();

DROP PROCEDURE IF EXISTS InitializeBlockchain;

CREATE OR REPLACE VIEW vista_blockchain AS
SELECT 
  b.block_id,
  b.asistencia_id,
  b.action,
  b.block_data,
  b.previous_hash,
  b.block_hash,
  b.timestamp,
  b.created_at,
  a.fecha,
  a.hora,
  a.user_id,
  u.nombres,
  u.apellidos,
  u.cedula
FROM blockchain b
LEFT JOIN asistencia a ON b.asistencia_id = a.asistencia_id
LEFT JOIN users u ON a.user_id = u.user_id
ORDER BY b.block_id ASC;
