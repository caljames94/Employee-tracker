import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;
// Create a new pool instance
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: 5432,
});
const connectToDb = async () => {
    try {
        const client = await pool.connect(); // Get a client from the pool
        console.log('Connected to the database.');
        return client; // Return the client to the caller
    }
    catch (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
};
export { pool, connectToDb };
