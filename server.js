app.get("/verify", async (req, res) => {
    const username = req.query.username;
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required." });
    }
  
    try {
      const user = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${username}&limit=10`);
      const foundUser = user.data.data.find(u => u.name === username);
  
      if (foundUser) {
        return res.json({
          success: true,
          message: "User found!",
          userId: foundUser.id,
          username: foundUser.name
        });
      } else {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ success: false, message: "Error verifying user" });
    }
  });
  