import mysql from 'mysql2/promise';

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      multipleStatements: true
    });
    console.log("Connected successfully!");
    
    // We can also try creating the db and reading the SQL file if this connects
    conn.end();
  } catch (e) {
    console.error("Connection failed:", e.message);
  }
}
test();
