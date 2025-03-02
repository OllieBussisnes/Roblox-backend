const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allows frontend to access the backend
app.use(express.json()); // Enables JSON support

const GROUP_ID = 6057393; // Your Roblox group ID

// Function to get user rank in the group
async function getUserRank(username) {
    try {
        const response = await axios.get(`https://groups.roblox.com/v1/groups/${GROUP_ID}/users`);
        const users = response.data.data;

        const user = users.find(u => u.user.username.toLowerCase() === username.toLowerCase());
        return user ? user.role.rank : 0;
    } catch (error) {
        console.error("Error fetching user rank:", error);
        return 0;
    }
}

// Function to check if the user has the emoji combo in their description
async function checkEmojiCombo(username) {
    try {
        const response = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${username}&limit=1`);
        const userId = response.data.data[0]?.id;

        if (!userId) return false;

        const userInfo = await axios.get(`https://users.roblox.com/v1/users/${userId}`);
        return userInfo.data.description.includes("🔑🌟"); // Change this to your required emoji combo
    } catch (error) {
        console.error("Error fetching user info:", error);
        return false;
    }
}

// The `/verify` route
app.get("/verify", async (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).json({ success: false, message: "Username required" });
    }

    const rank = await getUserRank(username);
    const emojiVerified = await checkEmojiCombo(username);

    res.json({
        success: true,
        rank: rank,
        emojiVerified: emojiVerified,
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
