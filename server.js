import express from 'express';
import axios from 'axios';  // For making requests to Roblox API

const app = express();
const port = process.env.PORT || 10000;  // Render dynamically assigns the port

app.get("/verify", async (req, res) => {
    const username = req.query.username;  // Get the username from the query string
    console.log(`Verifying username: ${username}`);

    try {
        // Roblox API request (you can modify this to actually verify the user)
        const response = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${username}&limit=10`);
        
        // Process response
        const userData = response.data.data.find(user => user.name === username);

        if (userData) {
            res.json({
                success: true,
                message: 'User found!',
                userId: userData.id,
                username: userData.name,
            });
        } else {
            res.json({
                success: false,
                message: 'User not found',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error verifying user',
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
