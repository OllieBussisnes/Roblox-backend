import express from "express";
import axios from "axios";

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

app.get("/verify", async (req, res) => {
    const { username } = req.query; // Get the username from query parameter

    try {
        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required!" });
        }

        // Make an API call to Roblox API to check if the user exists
        const response = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${username}&limit=10`);
        const user = response.data.data.find(user => user.name === username);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            message: "User found!",
            userId: user.id,
            username: user.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error verifying user" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
