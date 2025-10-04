import https from 'node:https'
import fs from 'node:fs'

import express from "express";
import cors from "cors";
import passport from "passport";

import { FRONTEND_URL, PORT } from "./config/global.js";
import { usersRouter } from "./routes/users.js";
import { rolesRouter } from "./routes/roles.js";
import { companiesRouter } from "./routes/companies.js";
import { attendanceRouter } from "./routes/attendance.js";
import { attendancesTypeRouter } from "./routes/attendancesType.js";
import { authRouter } from "./routes/auth.js";
import { resourcesRouter } from "./routes/resources.js";
import { queriesRouter } from './routes/queries.js';

//VUE
import { getAllPublic } from './controllers/users.js';

/// 
import dotenv from 'dotenv';
dotenv.config();



const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.disable("x-powered-by");

//  Ruta pública para pruebas con Vue
app.get('/public-users', getAllPublic);

// Ruta para gestionar el login
app.use('/auth', authRouter)

// Rutas para gestionar los modulos 
app.use('/users', usersRouter)
app.use('/roles', rolesRouter)
app.use('/companies', companiesRouter)
app.use('/attendances', attendanceRouter)
app.use('/attendances-type', attendancesTypeRouter)

// Rutas para gestionar la descarga de recursos
app.use('/resources', resourcesRouter)

// Ruta para gestionar las consultas de datos
app.use('/queries', queriesRouter)

// configuracion para habilitar https
const httpsOptions = {
  key: fs.readFileSync("./ssl/localhost-key.pem"),
  cert: fs.readFileSync("./ssl/localhost.pem")
}

// Crear servidor https
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Servidor corriendo en: https://localhost:${PORT}`);
})

// Servidor http
/* app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
}); */
