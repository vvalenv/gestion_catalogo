const db = { 
    host: 'mysql-xxxxx-tu-host.aivencloud.com', // El de Aiven
    port: 14724,                                 // El puerto que te dio Aiven
    user: 'avnadmin',
    password: 'tu_password_de_aiven',
    database: 'defaultdb',                       // O 'gonzalez' si la creaste
    ssl: {
        rejectUnauthorized: false                // Obligatorio para Aiven
    },
    waitForConnections: true,
    connectionLimit: 10
};

export default db;