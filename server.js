const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Home route to check if the backend is working
app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// ✅ Verify route
app.get("/verify", (req, res) => {
    res.send("Verify route is working!");
});

// ✅ Check rank route
app.get("/check-rank", (req, res) => {
    res.send("Check rank route is working!");
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
