import db from '../config/dbConfig.js';
import mysql from 'mysql2/promise';

export async function loginConsult(user, pass) {
  try {
    const connection = await mysql.createConnection(db);
    const [rows] = await connection.execute(
      'SELECT id FROM usuarios WHERE nombre = ? AND contra = SHA2(?, 256)',
      [user, pass]
    );
    await connection.end();
    return rows.length > 0;
  } catch (error) {
    console.error("Error en DB:", error);
    return false;
  }
}