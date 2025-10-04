/* import mysql from 'mysql2/promise';

import { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } from './global.js';

export const dbConfig = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
}

export const pool = mysql.createPool(dbConfig);
 */


/* vue*/
// backend/config/db.js

import mysql from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } from './global.js';

export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});
