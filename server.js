import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Ensure node-fetch is installed

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
    res.send("✅ Server is running!");
});

// Verify User Route
app.get("/verify", async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required" });
        }

        const robloxApiUrl = `https://users.roblox.com/v1/users/search?keyword=${username}&limit=1`;
        const response = await fetch(robloxApiUrl);
        const data = await response.json();

        if (!data || !data.data || data.data.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const user = data.data[0];
        res.json({ success: true, message: "User found!", username: user.name, userId: user.id });
    } catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
