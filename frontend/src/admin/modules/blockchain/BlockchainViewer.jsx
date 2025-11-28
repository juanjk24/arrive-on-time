import { useState, useEffect } from 'react';
import './blockchain-viewer.css';

const BlockchainViewer = () => {
  const [blocks, setBlocks] = useState([]);
  const [verification, setVerification] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [searchId, setSearchId] = useState('');

  // Obtener token del localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Cargar datos del blockchain
  const loadBlockchainData = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Obtener bloques
      const blocksResponse = await fetch('https://localhost:3000/blockchain/blocks', { headers });
      const blocksData = await blocksResponse.json();
      setBlocks(blocksData.blocks || []);

      // Obtener estadísticas
      const statsResponse = await fetch('https://localhost:3000/blockchain/stats', { headers });
      const statsData = await statsResponse.json();
      setStats(statsData.stats);

      // Verificar integridad
      const verifyResponse = await fetch('https://localhost:3000/blockchain/verify', { headers });
      const verifyData = await verifyResponse.json();
      setVerification(verifyData);

    } catch (error) {
      console.error('Error al cargar datos del blockchain:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  // Buscar historial de una asistencia
  const searchAttendanceHistory = async () => {
    if (!searchId) return;

    try {
      const token = getToken();
      const response = await fetch(`https://localhost:3000/blockchain/attendance/${searchId}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setBlocks(data.history);
      } else {
        alert('No se encontró historial para esta asistencia');
      }
    } catch (error) {
      console.error('Error al buscar historial:', error);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES');
  };

  // Función para obtener el color según la acción
  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE': return '#4caf50';
      case 'UPDATE': return '#ff9800';
      case 'DELETE': return '#f44336';
      case 'GENESIS': return '#9c27b0';
      default: return '#757575';
    }
  };

  if (loading) {
    return <div className="blockchain-loading">Cargando blockchain...</div>;
  }

  return (
    <div className="blockchain-viewer">
      <div className="blockchain-header">
        <h1>🔐 Sistema de Blockchain de Asistencias</h1>
        <p>Registro inmutable de todas las operaciones</p>
      </div>

      {/* Panel de estadísticas */}
      <div className="stats-panel">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalBlocks || 0}</div>
            <div className="stat-label">Total Bloques</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            {verification?.valid ? '✅' : '❌'}
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {verification?.valid ? 'VÁLIDA' : 'COMPROMETIDA'}
            </div>
            <div className="stat-label">Integridad</div>
          </div>
        </div>

        {stats?.actionStats?.map((stat) => (
          <div key={stat.action} className="stat-card">
            <div className="stat-icon" style={{ color: getActionColor(stat.action) }}>
              {stat.action === 'CREATE' && '➕'}
              {stat.action === 'UPDATE' && '✏️'}
              {stat.action === 'DELETE' && '🗑️'}
              {stat.action === 'GENESIS' && '🌟'}
            </div>
            <div className="stat-info">
              <div className="stat-value">{stat.count}</div>
              <div className="stat-label">{stat.action}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje de verificación */}
      {verification && (
        <div className={`verification-banner ${verification.valid ? 'valid' : 'invalid'}`}>
          <strong>{verification.message}</strong>
          {!verification.valid && verification.blockId && (
            <p>Bloque comprometido: #{verification.blockId}</p>
          )}
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="search-panel">
        <input
          type="number"
          placeholder="Buscar por ID de asistencia..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="search-input"
        />
        <button onClick={searchAttendanceHistory} className="search-button">
          🔍 Buscar Historial
        </button>
        <button onClick={loadBlockchainData} className="reload-button">
          🔄 Mostrar Todos
        </button>
      </div>

      {/* Lista de bloques */}
      <div className="blocks-container">
        <h2>Cadena de Bloques ({blocks.length} bloques)</h2>
        
        <div className="blocks-chain">
          {blocks.map((block, index) => (
            <div key={block.block_id} className="block-wrapper">
              <div 
                className={`block-card ${selectedBlock?.block_id === block.block_id ? 'selected' : ''}`}
                onClick={() => setSelectedBlock(selectedBlock?.block_id === block.block_id ? null : block)}
                style={{ borderLeftColor: getActionColor(block.action) }}
              >
                <div className="block-header">
                  <span className="block-id">Bloque #{block.block_id}</span>
                  <span className="block-action" style={{ backgroundColor: getActionColor(block.action) }}>
                    {block.action}
                  </span>
                </div>

                <div className="block-info">
                  <div className="info-row">
                    <span className="info-label">Asistencia ID:</span>
                    <span className="info-value">{block.asistencia_id}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Fecha:</span>
                    <span className="info-value">{formatDate(block.timestamp)}</span>
                  </div>
                </div>

                {/* Detalles expandibles */}
                {selectedBlock?.block_id === block.block_id && (
                  <div className="block-details">
                    <div className="detail-section">
                      <h4>📄 Datos del Bloque:</h4>
                      <pre>{JSON.stringify(block.block_data, null, 2)}</pre>
                    </div>

                    <div className="detail-section">
                      <h4>🔗 Hash del Bloque:</h4>
                      <code className="hash-code">{block.block_hash}</code>
                    </div>

                    <div className="detail-section">
                      <h4>🔗 Hash Anterior:</h4>
                      <code className="hash-code">{block.previous_hash}</code>
                    </div>
                  </div>
                )}
              </div>

              {/* Flecha de conexión entre bloques */}
              {index < blocks.length - 1 && (
                <div className="block-connector">
                  <div className="arrow-down">⬇️</div>
                  <div className="connector-label">Encadenado por hash</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {blocks.length === 0 && (
          <div className="empty-state">
            <p>No hay bloques en el blockchain</p>
            <p>Las asistencias registradas aparecerán aquí automáticamente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainViewer;
