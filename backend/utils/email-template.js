export function generateEmailTemplate(userId, name, date, time, attendanceType, id, action = 'create') {
    // Definir contenido según la acción
    const actionConfig = {
        create: {
            icon: '✓',
            title: 'Asistencia Registrada',
            message: 'Tu asistencia ha sido registrada con éxito en el sistema.',
            gradient: 'linear-gradient(135deg, #0ae98a 0%, #08b96d 100%)',
            borderColor: '#0ae98a',
            labelColor: '#0ae98a'
        },
        update: {
            icon: '🔄',
            title: 'Asistencia Actualizada',
            message: 'Tu asistencia ha sido actualizada correctamente en el sistema.',
            gradient: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
            borderColor: '#4A90E2',
            labelColor: '#4A90E2'
        },
        delete: {
            icon: '🗑️',
            title: 'Asistencia Eliminada',
            message: 'Tu asistencia ha sido eliminada del sistema.',
            gradient: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
            borderColor: '#E74C3C',
            labelColor: '#E74C3C'
        }
    };

    const config = actionConfig[action] || actionConfig.create;

    return `
        <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f4f7fa;
                        padding: 20px;
                        line-height: 1.6;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    .header {
                        background: ${config.gradient};
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #ffffff;
                        font-size: 28px;
                        font-weight: 600;
                        margin: 0;
                        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 18px;
                        color: #333333;
                        margin-bottom: 20px;
                        font-weight: 500;
                    }
                    .message {
                        font-size: 16px;
                        color: #555555;
                        margin-bottom: 30px;
                    }
                    .details-title {
                        font-size: 16px;
                        color: #333333;
                        margin-bottom: 15px;
                        font-weight: 600;
                    }
                    .details-box {
                        background-color: #d9dfdeff;
                        border-left: 4px solid ${config.borderColor};
                        border-radius: 8px;
                        padding: 20px;
                        margin-bottom: 30px;
                    }
                    .detail-item {
                        display: flex;
                        padding: 12px 0;
                        border-bottom: 1px solid #e8f5f1;
                    }
                    .detail-item:last-child {
                        border-bottom: none;
                    }
                    .detail-label {
                        font-weight: 600;
                        color: ${config.labelColor};
                        min-width: 180px;
                        font-size: 15px;
                    }
                    .detail-value {
                        color: #333333;
                        font-size: 15px;
                    }
                    .footer {
                        background-color: #f8f9fa;
                        padding: 25px 30px;
                        text-align: center;
                        border-top: 1px solid #e9ecef;
                    }
                    .footer-text {
                        font-size: 14px;
                        color: #6c757d;
                        margin: 0;
                    }
                    .success-icon {
                        width: 60px;
                        height: 60px;
                        background-color: #ffffff;
                        border-radius: 50%;
                        margin: 0 auto 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 30px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="success-icon">${config.icon}</div>
                        <h1>${config.title}</h1>
                    </div>
                    <div class="content">
                        <p class="greeting">Hola ${name},</p>
                        <p class="message">${config.message}</p>
                        <p class="details-title">Detalles de tu ${action === 'delete' ? 'registro eliminado' : 'registro'}:</p>
                        <div class="details-box">
                             <div class="detail-item">
                                <span class="detail-label">Código de usuario:</span>
                                <span class="detail-value">${userId}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">📅 Fecha:</span>
                                <span class="detail-value">${date}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">🕒 Hora:</span>
                                <span class="detail-value">${time}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">📋 Tipo de Asistencia:</span>
                                <span class="detail-value">${attendanceType}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Código de Asistencia:</span>
                                <span class="detail-value">${id}</span>
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        <p class="footer-text">Este es un correo automático, por favor no responder.</p>
                        <p class="footer-text" style="margin-top: 5px;">© ${new Date().getFullYear()} Arrive On Time - Sistema de Asistencias</p>
                    </div>
                </div>
            </body>
        </html>
    `;
}