const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Roblox Backend is Live! 🚀");
});

// Route to verify Roblox username
app.get("/verify", async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required!" });
        }

        console.log(`🔍 Searching for user: ${username}`);

        // Fetch user data from Roblox API
        const response = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${username}`);

        // Extract user data
        const users = response.data.data;
        const user = users.find(u => u.name.toLowerCase() === username.toLowerCase());

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            message: "User found!",
            userId: user.id,
            username: user.name
        });

    } catch (error) {
        console.error("❌ Error fetching user:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
