import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Ensure this is installed

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Verify user endpoint
app.get('/verify', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) return res.status(400).json({ success: false, message: "Username is required" });

        const response = await fetch(`https://users.roblox.com/v1/usernames/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
        });

        const data = await response.json();
        if (!data.data || data.data.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userId = data.data[0].id;

        // Fetch user's profile description
        const descResponse = await fetch(`https://users.roblox.com/v1/users/${userId}`);
        const descData = await descResponse.json();
        const description = descData.description || "";

        res.json({ success: true, userId, username, description });
    } catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

// Description endpoint (For testing)
app.get('/description', (req, res) => {
    res.send("Description endpoint is working!");
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
