const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// ✅ Helper function to fetch user info
async function getUserInfo(username) {
    try {
        console.log(`🔎 Searching for user: ${username}`);
        
        // ✅ Use the correct Roblox API
        const response = await axios.post("https://users.roblox.com/v1/users/search", {
            keyword: username,
            limit: 1
        });

        // ✅ Ensure data is valid
        if (!response.data || !response.data.data || response.data.data.length === 0) {
            console.log(`❌ User not found: ${username}`);
            return null;
        }

        return response.data.data[0]; // First result
    } catch (error) {
        console.error("❌ Error fetching user:", error.message);
        return null;
    }
}

// ✅ Verify route
app.get("/verify", async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required" });
        }

        // Get user info
        const user = await getUserInfo(username);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, user });
    } catch (error) {
        console.error("❌ Internal Server Error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
