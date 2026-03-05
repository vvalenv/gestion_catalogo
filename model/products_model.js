import db from '../config/dbConfig.js';
import mysql from 'mysql2/promise';
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
config();
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

export async function addProduct(title,price,desc,img,category,type) {
  let connection;
  try {
    let urlImagen;

    if (img && typeof img === 'string' && img.trim() !== "") {
        // Si hay imagen, la subimos
        const result = await cloudinary.uploader.upload(img, {
            folder: 'productos_gonzalez',
            use_filename: true,      // Usa el nombre del archivo (ej: "cable")
            unique_filename: false,   // Evita que Cloudinary le agregue letras aleatorias
            overwrite: false         // IMPORTANTE: Si ya existe, no lo pisa, solo devuelve la info
        });
        urlImagen = result.secure_url;
    } else {
        urlImagen = "https://res.cloudinary.com/dnnplqasa/image/upload/v1772420651/default_p75pg4.jpg";
    };

    connection = await mysql.createConnection(db);
    let sql = "";
    let valores = [];
    sql = `INSERT INTO ${category} (titulo, precio, descripcion, imagen, categoria, fecha) VALUES (?, ?, ?, ?, ?, NOW())`;
    valores = [title, price, desc, urlImagen, type];

    const [rows] = await connection.execute(sql, valores);
    return rows.affectedRows > 0;
  } catch (error) {
      console.error("Error en DB:", error);
      return false;
  } finally {
    if (connection) {
      await connection.end();
    };
  }
}

export async function getProductsByCategory(category) {
    let connection;
    try {
        connection = await mysql.createConnection(db);
        // Traemos todos los productos de esa tabla/categoría
        const [rows] = await connection.execute(`SELECT * FROM ${category}`);
        return rows;
    } catch (error) {
        console.error(error);
        return [];
    } finally {
        if (connection) await connection.end();
    }
}
export async function deleteProduct(id, category) {
    let connection;
    try {
        connection = await mysql.createConnection(db);
        
        // SQL para eliminar por ID en la tabla específica
        const sql = `DELETE FROM ${category} WHERE id = ?`;
        
        // Ejecutamos pasando el ID como parámetro seguro
        const [rows] = await connection.execute(sql, [id]);
        
        await connection.end();
        // Devolvemos true si se eliminó al menos una fila
        return rows.affectedRows > 0;
    } catch (error) {
        console.error("Error al eliminar en DB:", error.message);
        return false;
    } finally {
        if (connection) await connection.end();
    }
}
// Buscar uno solo para llenar el formulario
export async function getProductById(id, category) {
    let connection;
    try {
        connection = await mysql.createConnection(db);
        // Usamos ? para evitar inyecciones y asegurar el ID
        const [rows] = await connection.execute(
            `SELECT * FROM ${category} WHERE id = ?`, 
            [id]
        );
        
        // IMPORTANTE: Retornar el primer elemento o null si no existe
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error en getProductById:", error.message);
        return null;
    } finally {
        if (connection) await connection.end();
    }
}

// Guardar los cambios
export async function updateProduct(datos) {
    let connection = await mysql.createConnection(db);
    const sql = `UPDATE ${datos.cat} SET titulo = ?, precio = ?, descripcion = ? WHERE id = ?`;
    const [result] = await connection.execute(sql, [datos.titulo, datos.precio, datos.descripcion, datos.id]);
    await connection.end();
    return result.affectedRows > 0;
}