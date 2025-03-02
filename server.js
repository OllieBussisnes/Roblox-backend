import express from "express";

const app = express();

// Use the port provided by Render, or default to 10000
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Make sure to bind to 0.0.0.0 for Render
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
