const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin")
const bcrypt = require("bcrypt");

router.post("/create/backoffice/admin", async (req, res) => {
    try {
        const { username, password, user_id } = req.body

        const existingAdmin = await Admin.findOne({
            where: {
                username: username
            }
        });

        if (existingAdmin) {
            return res.status(409).json({ error: "Admin already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin user with the hashed password
        const newAdmin = new Admin({
            user_id: user_id,
            username,
            password: hashedPassword,

        });

        // Save the new admin to the database
        await newAdmin.save();

        // Respond with success message
        res.status(201).json({ message: "Admin created successfully." });

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

router.post("/login/backoffice/admin", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(200).json({ error: "Missing username or password." });
        }

        // Find the admin user in the database
        const admin = await Admin.findOne({
            where: {
                username: username
            }
        });

        // Check if the admin exists
        if (!admin) {
            return res.status(200).json({ error: "Invalid credentials. wrong username" });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return res.status(200).json({ error: "Invalid credentials. wrong password" });
        }

        res.status(200).json({ admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router