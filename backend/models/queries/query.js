export const queryUno = `SELECT conteo.user_id, conteo.nombres, conteo.apellidos, conteo.correo, conteo.rol_name, conteo.nombre_empresa, conteo.total_entradas
FROM (
    -- Subconsulta que cuenta las asistencias de tipo "Entrada" por usuario
    SELECT u.user_id, u.nombres, u.apellidos, u.correo, r.rol_name, e.nombre_empresa, COUNT(a.asistencia_id) AS total_entradas
    FROM users as u
    inner JOIN asistencia as a ON u.user_id = a.user_id
    inner JOIN tipo_asistencia as ta ON a.tipo_id = ta.tipo_id
    inner JOIN user_rol as r ON u.rol_id = r.rol_id
    inner JOIN empresas as e ON u.empresa_id = e.empresa_id
    WHERE ta.tipo_asistencia = 'Entrada'
    GROUP BY u.user_id, u.nombres, u.apellidos, u.correo, r.rol_name, e.nombre_empresa
) AS conteo
WHERE 
	-- Subconsulta para encontrar el máximo número de entradas
    conteo.total_entradas = (
        SELECT MAX(max_conteo.total_entradas)
        FROM (
            SELECT COUNT(a.asistencia_id) AS total_entradas
            FROM users as u
            inner JOIN asistencia as a ON u.user_id = a.user_id
            inner JOIN tipo_asistencia as ta ON a.tipo_id = ta.tipo_id
            WHERE ta.tipo_id = 1
            GROUP BY u.user_id
        ) AS max_conteo
    )
ORDER BY conteo.user_id;`

export const queryDos = `SELECT u.user_id, u.nombres, u.apellidos, 
(SELECT tp.tipo_asistencia FROM tipo_asistencia AS tp 
    WHERE tp.tipo_id = 1) AS tipo_de_asistencia
FROM users AS u
WHERE EXISTS (
    SELECT u.nombres, u.apellidos FROM asistencia AS a
    WHERE a.user_id = u.user_id
        AND a.tipo_id = 1
        AND a.hora < '16:30:00'
);`