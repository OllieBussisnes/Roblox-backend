const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(bodyParser.json()); // Parses JSON bodies

// Use Render-assigned PORT or default to 3000 locally
const PORT = process.env.PORT || 3000;

// Sample Route (Modify as needed)
app.get("/", (req, res) => {
    res.send("🚀 Server is running on Render!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
