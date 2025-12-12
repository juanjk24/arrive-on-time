import { RESEND_API_KEY } from "../config/global.js";
import { Resend } from "resend";
import { UserModel } from "../models/user.js";
import { AttendanceTypeModel } from "../models/attendanceType.js";
import { generateEmailTemplate } from "../utils/email-template.js";

const resend = new Resend(RESEND_API_KEY);

export class EmailController {
    static async send(req, res) {
        const { date, time, userId, attendanceTypeId, attendanceId, action = 'create' } = req.body;

        if (!userId || !attendanceTypeId || !date || !time || !attendanceId) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }

        // obtener el usuario por su id
        const [user] = await UserModel.getById({ id: userId });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // obtener el tipo de asistencia
        const [attendanceType] = await AttendanceTypeModel.getById({ id: attendanceTypeId });

        if (!attendanceType) {
            return res.status(404).json({ error: "Tipo de asistencia no encontrado" });
        }  

        // Definir el asunto según la acción
        const subjects = {
            create: "Asistencia Registrada - Arrive On Time",
            update: "Asistencia Actualizada - Arrive On Time",
            delete: "Asistencia Eliminada - Arrive On Time"
        };

        const subject = subjects[action] || subjects.create;

        // enviamos el correo
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: [user.correo],
            subject: subject,
            html: generateEmailTemplate(userId, user.nombres, date, time, attendanceType.tipo_asistencia, attendanceId, action),
        });

        if (error) {
            return res.status(400).json({ error });
        }

        res.status(200).json({ data });
    }
}