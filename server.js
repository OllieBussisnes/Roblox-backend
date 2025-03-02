import express from "express";
import axios from "axios";

const app = express();
const PORT = 10000;

app.get("/verify", async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required" });
    }

    try {
        const response = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${username}&limit=10`);
        const users = response.data.data;

        const foundUser = users.find(user => user.name.toLowerCase() === username.toLowerCase());

        if (!foundUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, userId: foundUser.id, displayName: foundUser.displayName });

    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ success: false, message: "Error fetching data" });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
