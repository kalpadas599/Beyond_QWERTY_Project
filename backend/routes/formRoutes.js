const express = require("express");
const router = express.Router();
const db = require("../config/db"); // PostgreSQL pool
const authMiddleware = require("../middleware/authMiddleware");

// 📌 POST /save-form — Store form data
router.post("/save-form", authMiddleware, async (req, res) => {
    const { id, formName, fields } = req.body;
    const userId = req.user.id;  

    if (!formName || !fields || !userId) {
        return res.status(400).json({ message: "Form name, fields, and user ID are required" });
    }

    try {
        const insertQuery = "INSERT INTO forms (form_id, user_id, form_name, fields) VALUES ($1, $2, $3, $4)";
        await db.query(insertQuery, [id, userId, formName, JSON.stringify(fields)]);
        res.status(201).json({ message: "Form saved successfully", id });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error saving form data" });
    }
});

// 📌 GET /forms — Fetch forms for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const selectQuery = "SELECT * FROM forms WHERE user_id = $1";
        const results = await db.query(selectQuery, [userId]);
        res.json(results.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error fetching forms" });
    }
});

// 📌 GET /all-forms — Fetch all forms except the user's own
router.get("/all-forms", authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const selectQuery = "SELECT * FROM forms WHERE user_id != $1";
        const results = await db.query(selectQuery, [userId]);
        res.json(results.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error fetching all forms" });
    }
});

// 📌 Fetch Single Form by ID
router.get("/fill-form/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query("SELECT * FROM forms WHERE form_id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Form not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error fetching form" });
    }
});

// 📌 GET /responses/:formId — Fetch responses for a specific form
router.get("/responses/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const responseQuery = `
            SELECT * FROM form_responses 
            WHERE form_name = (SELECT form_name FROM forms WHERE form_id = $1)
        `;
        const results = await db.query(responseQuery, [id]);

        if (results.rowCount === 0) {
            return res.status(404).json({ message: "No responses found for this form" });
        }

        res.json(results.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error fetching form responses" });
    }
});

// 📌 GET /form-creators — Fetch usernames of form creators
router.get("/form-creators", authMiddleware, async (req, res) => {
    try {
        const query = `
            SELECT users.username 
            FROM users 
            INNER JOIN forms ON users.id = forms.user_id
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error fetching form creators" });
    }
});

// 📌 Submit Form Data
router.post("/submit", authMiddleware, async (req, res) => {
    const { formName, responses } = req.body;
    const username = req.user.username;

    if (!formName || !username || !responses) {
        return res.status(400).json({ message: "Some fields are missing, which are required" });
    }

    try {
        const insertQuery = "INSERT INTO form_responses (form_name, username, responses) VALUES ($1, $2, $3)";
        await db.query(insertQuery, [formName, username, JSON.stringify(responses)]);
        res.status(201).json({ message: "Form submitted successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error saving form response" });
    }
});

// 📌 DELETE /delete/:id — Delete a form by ID
router.delete("/delete/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id || !userId) {
        return res.status(400).json({ message: "Form ID and user ID are required" });
    }

    try {
        const deleteQuery = "DELETE FROM forms WHERE form_id = $1 AND user_id = $2";
        const result = await db.query(deleteQuery, [id, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Form not found or not authorized to delete" });
        }
        res.json({ message: "Form deleted successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error deleting form" });
    }
});

module.exports = router;
