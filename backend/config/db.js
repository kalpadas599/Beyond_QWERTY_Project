const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Neon DB
});


pool.connect()
    .then(() => console.log("Connected to Neon DB"))
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1);
    });

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

const createFormsTable = `
    CREATE TABLE IF NOT EXISTS forms (
        form_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INT NOT NULL,
        form_name VARCHAR(255) NOT NULL,
        fields JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`;

const createResponsesTable = `
    CREATE TABLE IF NOT EXISTS form_responses (
        response_id SERIAL PRIMARY KEY,
        form_name VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        responses JSONB NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

(async () => {
    try {
        await pool.query(createUsersTable);
        console.log("Table ensured: users");

        await pool.query(createFormsTable);
        console.log("Table ensured: forms");

        await pool.query(createResponsesTable);
        console.log("Table ensured: form_responses");
    } catch (err) {
        console.error("Table creation failed:", err);
        process.exit(1);
    }
})();

module.exports = pool;
