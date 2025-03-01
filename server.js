const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const GROUP_ID = 6057393; // Your Roblox group ID

app.use(cors());

app.get('/', (req, res) => {
    res.send('Backend is working!');
});

app.get('/check-rank', async (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        // Get user ID from username
        const userResponse = await axios.get(`https://users.roblox.com/v1/usernames/users`, {
            headers: { "Content-Type": "application/json" },
            data: { usernames: [username], excludeBannedUsers: true }
        });

        if (!userResponse.data.data.length) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = userResponse.data.data[0].id;

        // Get user's rank in the group
        const rankResponse = await axios.get(`https://groups.roblox.com/v2/users/${userId}/groups/roles`);
        const groupData = rankResponse.data.data.find(group => group.group.id === GROUP_ID);

        if (groupData) {
            return res.json({ username, rank: groupData.role.rank });
        } else {
            return res.json({ error: "User is not in the group" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to check rank" });
    }
});

app.listen(PORT, () => console.log(`Backend is running on port ${PORT}`));
