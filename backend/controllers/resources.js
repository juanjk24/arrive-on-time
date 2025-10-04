import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import mysqldump from "mysqldump";

/* import { dbConfig } from "../config/db.js"; */
import { AttendanceModel } from "../models/attendance.js";
import { UserModel } from "../models/user.js";
import { generateExcel } from "../utils/generate-excel.js";
import { createZip } from "../utils/create-zip.js";

//VUE
import { pool } from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class ResourcesController {
  // Metodo para exportar la base de datos
  static async getDB(req, res) {
    const { userId } = req;

    const sqlFile = path.join(__dirname, "../../backup.sql");
    const zipFile = path.join(__dirname, "../../backup.zip");

    try {
      const [user] = await UserModel.getById({ id: userId });

      await mysqldump({ connection: dbConfig, dumpToFile: sqlFile });

      await createZip(sqlFile, zipFile, user.cedula.toString());

      res.download(zipFile, "backup.zip", (err) => {
        if (err) {
          console.error("Error al enviar el archivo ZIP:", err);
          res.status(500).send("Error al descargar la base de datos.");
        }

        fs.unlinkSync(sqlFile);
        fs.unlinkSync(zipFile);
      });
    } catch (error) {
      console.error("Error al generar el backup:", error);
      res.status(500).send("Error al generar el backup.");
    }
  }

  // Método para descargar todas las asistencias en formato Excel
  static async getAllAttendances(req, res) {
    const { userId } = req;

    const excelFile = path.join(__dirname, "../asistencias.xlsx");
    const zipFile = path.join(__dirname, "../asistencias.zip");

    try {
      const attendances = await AttendanceModel.getAll();
      const [user] = await UserModel.getById({ id: userId });
      await generateExcel(attendances, excelFile);

      await createZip(excelFile, zipFile, user.cedula.toString());

      res.download(zipFile, "asistencias.zip", (err) => {
        if (err) {
          console.error("Error al enviar el archivo ZIP:", err);
          res.status(500).send("Error al descargar las asistencias.");
        }

        fs.unlinkSync(excelFile);
        fs.unlinkSync(zipFile);
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener las asistencias" });
    }
  }

  // Método para descargar asistencias de un usuario en formato Excel
  static async getYourAttendances(req, res) {
    const { userId } = req;

    const excelFile = path.join(__dirname, `../asistencias-${userId}.xlsx`);
    const zipFile = path.join(__dirname, `../asistencias-${userId}.zip`);

    try {
      const attendances = await AttendanceModel.getByUserId({ userId });
      const [user] = await UserModel.getById({ id: userId });

      await generateExcel(attendances, excelFile);

      await createZip(excelFile, zipFile, user.cedula.toString());

      res.download(zipFile, `asistencias-${userId}.zip`, (err) => {
        if (err) {
          console.error("Error al enviar el archivo ZIP:", err);
          res.status(500).send("Error al descargar las asistencias.");
        }

        fs.unlinkSync(excelFile);
        fs.unlinkSync(zipFile);
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener las asistencias" });
    }
  }
}