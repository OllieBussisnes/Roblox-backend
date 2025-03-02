const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const GROUP_ID = "6057393"; // Change to your Roblox group ID

// Endpoint to verify a user's rank and emoji combo
app.get("/verify", async (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required." });
    }

    try {
        // Get user ID from Roblox API
        const userResponse = await axios.get(`https://users.roblox.com/v1/usernames/users`, {
            data: { usernames: [username], excludeBannedUsers: true }
        });

        if (userResponse.data.data.length === 0) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const userId = userResponse.data.data[0].id;

        // Get user's rank in the group
        const rankResponse = await axios.get(`https://groups.roblox.com/v1/users/${userId}/groups/roles`);
        const groupInfo = rankResponse.data.data.find(group => group.group.id.toString() === GROUP_ID);

        if (!groupInfo) {
            return res.status(403).json({ success: false, message: "User is not in the group." });
        }

        const userRank = groupInfo.role.rank;
        if (userRank < 8) {
            return res.status(403).json({ success: false, message: "You must be rank 8+ to access this website." });
        }

        // Get user's description
        const descriptionResponse = await axios.get(`https://users.roblox.com/v1/users/${userId}`);
        const description = descriptionResponse.data.description || "";

        // Generate an emoji combo
        const emojiCombo = "🔥⭐"; // Change this to a dynamically generated emoji combo if needed

        // Check if the user's description contains the required emoji combo
        const emojiVerified = description.includes(emojiCombo);

        res.json({ success: true, username, rank: userRank, emojiVerified, emojiCombo });
    } catch (error) {
        console.error("Error verifying user:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
