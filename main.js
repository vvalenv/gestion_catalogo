import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { loginConsult } from './model/users_model.js';
import { addProduct, getProductsByCategory, deleteProduct, getProductById, updateProduct} from './model/products_model.js';
import Store from 'electron-store';
import fs from 'fs';
const store = new Store();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 400,
    minWidth: 400,
    icon: path.join(__dirname, '/public/img/logo.png'),
    webPreferences: {
      preload: path.join(__dirname, '/public/js/preload.js')
    },
    nodeIntegration: false, 
    contextIsolation: true
  });

  win.loadFile('index.html');

  win.webContents.on('did-finish-load', () => {
    const session = store.get('user-session');
    if (session) {
      win.webContents.send('session-restored', session);
    }
  });
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

ipcMain.handle('login-attempt', async (event, credentials) => {
  const { user, pass } = credentials;

  if (loginConsult(user, pass)) {
    store.set('user-session', { username: credentials.user });
    return { success: true };
  } else {
    return { success: false, message: 'Credenciales incorrectas' };
  }
});

ipcMain.handle('guardar-producto', async (event, datos) => {
       const { title, price, desc, img, category, type } = datos;

       const valida = await addProduct(title,price,desc,img,category,type);
       if (valida) {
        return { success: true };
       } else {
        return { success: false, message: 'Error al ingresar producto'};
       }
});

ipcMain.handle('obtener-productos', async (event, categoria) => {
    return await getProductsByCategory(categoria);
});

ipcMain.handle('eliminar-producto', async (event, id, categoria) => {
    try {
        // Llamamos al modelo para borrar de MariaDB
        const eliminado = await deleteProduct(id, categoria);
        
        if (eliminado) {
            return { success: true };
        } else {
            return { success: false, message: "No se encontró el producto o no se pudo eliminar." };
        }
    } catch (error) {
        console.error("Error en IPC eliminar-producto:", error);
        return { success: false, message: error.message };
    }
});

ipcMain.handle('obtener-producto-id', async (event, id, cat) => {
    return await getProductById(id, cat);
});

ipcMain.handle('edita-producto', async(event, datos) => { 
  try {
    const edita = await updateProduct(datos);
    if (edita) {
      return { success: true };
    } else {
      return { success: false, message: "No se pudo editar el producto." };
    }
  } catch(error) {
    console.error("Error al editar el producto:", error);
    return { success: false, message: error.message };
  }
});

ipcMain.on('logout-action', () => {
  // Aquí podrías limpiar tokens o variables de sesión
  store.delete('user-session');
  console.log("Sesión cerrada");
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})