const db = { 
    host: 'mysql-2dbac228-gonzalez.i.aivencloud.com', // El de Aiven
    port: 14724,                                 // El puerto que te dio Aiven
    user: 'avnadmin',
    password: 'AVNS_mmFJUAw6ttFfLJAGLvR',
    database: 'defaultdb',                       // O 'gonzalez' si la creaste
    ssl: {
        rejectUnauthorized: false                // Obligatorio para Aiven
    },
    waitForConnections: true,
    connectionLimit: 10
};

export default db;