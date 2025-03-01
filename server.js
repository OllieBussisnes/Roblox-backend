const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;
const GROUP_ID = 6057393; // Replace this with your actual group ID

app.use(cors());

// Route to check a user's rank
app.get("/check-rank", async (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        // Fetch user data from Roblox API
        const response = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${username}&limit=100`);
        const user = response.data.data.find(user => user.name.toLowerCase() === username.toLowerCase());

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = user.id;

        // Fetch group rank
        const rankResponse = await axios.get(`https://groups.roblox.com/v1/users/${userId}/groups/roles`);
        const groupData = rankResponse.data.data.find(group => group.group.id === GROUP_ID);

        if (!groupData) {
            return res.status(404).json({ error: "User is not in the group" });
        }

        return res.json({ username, rank: groupData.role.rank, role: groupData.role.name });

    } catch (error) {
        console.error("Error checking rank:", error.message);
        return res.status(500).json({ error: "Failed to check rank" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);
});
