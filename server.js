const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); // Allow frontend requests

// ✅ Randomly generate 5 emojis as the required combo
function getRandomEmojis() {
    const emojiList = ["🚀", "🔥", "✨", "💎", "🎉", "🌟", "🦄", "📚", "⚡", "🎮", "🔑", "🔷"];
    return Array.from({ length: 5 }, () => emojiList[Math.floor(Math.random() * emojiList.length)]);
}

// Store required emojis for each user
const userEmojis = {};

// ✅ Route: Verify a Roblox username
app.get('/verify', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) return res.json({ success: false, message: "No username provided!" });

        // Step 1: Get User ID from Roblox
        const userResponse = await fetch(`https://users.roblox.com/v1/usernames/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usernames: [username], excludeBannedUsers: true })
        });

        const userData = await userResponse.json();
        if (!userData.data || userData.data.length === 0) {
            return res.json({ success: false, message: "User not found!" });
        }

        const userId = userData.data[0].id;

        // Step 2: Fetch the User’s Description
        const descriptionResponse = await fetch(`https://users.roblox.com/v1/users/${userId}`);
        const descriptionData = await descriptionResponse.json();
        const description = descriptionData.description || "";

        // Step 3: Get or Assign the Required Emoji Combo
        if (!userEmojis[username]) {
            userEmojis[username] = getRandomEmojis();
        }
        const requiredEmojis = userEmojis[username];

        // Step 4: Check if All Emojis are Present
        const hasAllEmojis = requiredEmojis.every(emoji => description.includes(emoji));

        // Step 5: Send the Final Response
        res.json({
            success: hasAllEmojis,
            message: hasAllEmojis ? "Verification successful!" : "Missing required emojis in description.",
            userId,
            username,
            description,
            requiredEmojis
        });

    } catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

// ✅ Route: Get Required Emojis for a Username
app.get('/emoji', (req, res) => {
    const username = req.query.username;
    if (!username || !userEmojis[username]) {
        return res.json({ success: false, message: "No emoji combo found for this user." });
    }
    res.json({ success: true, requiredEmojis: userEmojis[username] });
});

// ✅ Start the Server
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
