const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Default Route (Fixes "Cannot GET /" Error)
app.get("/", (req, res) => {
    res.send("Backend is working! 🎉");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
