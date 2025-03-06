const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Pool } = require("pg");  // PostgreSQL client

dotenv.config();

// PostgreSQL Database Connection
const db = new Pool({
    connectionString: process.env.DATABASE_URL, // Use DATABASE_URL for Neon DB
    ssl: { rejectUnauthorized: false }  // Required for Neon DB
});

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const userQuery = "SELECT username FROM users WHERE id = $1";
        const { rows, rowCount } = await db.query(userQuery, [userId]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = { id: userId, username: rows[0].username };
        next();
    } catch (error) {
        console.error("Invalid token:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
