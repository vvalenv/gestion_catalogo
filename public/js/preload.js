const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('authAPI', {
  getFilePath: (file) => webUtils.getPathForFile(file),
  login: (credentials) => ipcRenderer.invoke('login-attempt', credentials),
  logout: () => ipcRenderer.send('logout-action'),
  onSessionRestored: (callback) => ipcRenderer.on('session-restored', (event, data) => callback(data)),
  enviarProducto: (datos) => ipcRenderer.invoke('guardar-producto', datos),
  obtenerProductos: (cat) => ipcRenderer.invoke('obtener-productos', cat),
  eliminarProducto: (id, categoria) => ipcRenderer.invoke('eliminar-producto', id, categoria),
  obtenerProductoPorId: (id, cat) => ipcRenderer.invoke('obtener-producto-id', id, cat),
  actualizarProducto: (datos) => ipcRenderer.invoke('edita-producto', datos)
});