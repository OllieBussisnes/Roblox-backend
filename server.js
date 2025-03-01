const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;
const GROUP_ID = 6057393;

app.use(cors());

app.get("/", (req, res) => {
    res.send("Backend is working!");
});

app.get("/check-rank", async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        // Get user ID from Roblox API
        const userResponse = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${username}&limit=10`);
        const user = userResponse.data.data.find(user => user.name.toLowerCase() === username.toLowerCase());

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get rank in group
        const rankResponse = await axios.get(`https://groups.roblox.com/v1/users/${user.id}/groups/roles`);
        const groupData = rankResponse.data.data.find(group => group.group.id === GROUP_ID);

        if (!groupData) {
            return res.status(404).json({ error: "User is not in the group" });
        }

        res.json({
            username: user.name,
            rank: groupData.role.rank,
            role: groupData.role.name
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to check rank" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);
});
