// const sql = require('mssql');

// // USE THIS EXACT CONFIG
// const config = {
//     server: 'localhost\\MSSQLLocalDB',
//     database: 'UserDb',
//     options: {
//         trustedConnection: true,
//         trustServerCertificate: true,
//         encrypt: false,
//         connectTimeout: 30000,
//         instanceName: 'MSSQLLocalDB'
//     }
// };

// // Create a single connection pool
// const pool = new sql.ConnectionPool(config);
// const poolConnect = pool.connect();

// poolConnect.then(() => {
//     console.log('✅ Connected to SQL Server!');
// }).catch(err => {
//     console.error('❌ Connection failed:', err.message);
//     console.log('\nLAST RESORT FIXES:');
//     console.log('1. Run: "sqllocaldb stop MSSQLLocalDB"');
//     console.log('2. Run: "sqllocaldb start MSSQLLocalDB"');
//     console.log('3. Try Docker instead:');
//     console.log('   docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2019-latest');
//     process.exit(1);
// });

// // Properly export the pool promise
// module.exports = {
//     pool,
//     poolConnect,
//     sql
// };

const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',  // Your MySQL username
    password: 'manager',  // Your MySQL password
    database: 'users',
});

// Export the pool
module.exports = {
    pool
};
