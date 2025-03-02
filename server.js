const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const GROUP_ID = 6057393; // Your Roblox Group ID

app.use(cors());

// Function to get user ID from username
async function getUserId(username) {
    try {
        const response = await axios.get(`https://users.roblox.com/v1/usernames/users`, {
            data: { usernames: [username], excludeBannedUsers: true }
        });
        return response.data.data[0]?.id || null;
    } catch (error) {
        return null;
    }
}

// Function to get user rank in the group
async function getUserRank(userId) {
    try {
        const response = await axios.get(`https://groups.roblox.com/v1/users/${userId}/groups/roles`);
        const group = response.data.data.find(g => g.group.id === GROUP_ID);
        return group ? group.role.rank : 0;
    } catch (error) {
        return 0;
    }
}

// Function to get user description and check emoji
async function checkEmojiCombo(userId) {
    try {
        const response = await axios.get(`https://users.roblox.com/v1/users/${userId}`);
        const description = response.data.description || "";
        const requiredEmoji = "🎉🔥"; // Change this if needed
        return description.includes(requiredEmoji);
    } catch (error) {
        return false;
    }
}

// API Endpoint for Verification
app.get("/verify", async (req, res) => {
    const username = req.query.username;
    if (!username) return res.json({ success: false, message: "No username provided" });

    const userId = await getUserId(username);
    if (!userId) return res.json({ success: false, message: "User not found" });

    const rank = await getUserRank(userId);
    const emojiVerified = await checkEmojiCombo(userId);

    res.json({
        success: true,
        rank,
        emojiVerified,
        emojiCombo: "🎉🔥" // This tells users what emoji to add
    });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
