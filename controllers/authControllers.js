import axios from "axios";


//  Temporary in-memory store (replace with DB later)
export const userTokens = {};


// =============================
//  Step 1: Redirect to GitHub
// =============================
export const githubLogin = (req, res) => {
  const { userId } = req.query;
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;

  console.log("CLIENT ID:", CLIENT_ID);
  if (!userId) {
    return res.status(400).send("Missing userId");
  }

  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=public_repo&state=${userId}`;

  console.log("🔗 Redirecting user:", userId);

  res.redirect(url);
};


// =============================
//  Step 2: Handle Callback
// =============================
export const githubCallback = async (req, res) => {
  try {
    const { code, state: userId } = req.query;
    const CLIENT_ID = process.env.CLIENT_ID;       // HERE
    const CLIENT_SECRET = process.env.CLIENT_SECRET;

    if (!code || !userId) {
      return res.status(400).send("Invalid OAuth request");
    }

    //  Exchange code → access token
    const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        null,
        {
          params: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code
          },
          headers: {
            Accept: "application/json"
          }
        }
    );
    

    const accessToken = response.data.access_token;

    if (!accessToken) {
      console.error(" No access token received:", response.data);
      return res.status(400).send("Failed to authenticate");
    }

    //  Store token mapped to userId
    userTokens[userId] = accessToken;

    console.log("✅ Token stored for user:", userId);

    const userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const githubUsername = userRes.data.login;

    // simple UX response
    res.send(`
      <script>
        window.location.href = "https://leetcode.com/?github_connected=true&username=${githubUsername}&userId=${userId}";
      </script>
    `);

  } catch (err) {
    console.error("❌ OAuth Error:", err.response?.data || err.message);

    res.status(500).send("OAuth failed");
  }
};

// POST /api/logout
export const logout = (req, res) => {
  const { userId } = req.body;

  delete userTokens[userId];

  console.log(" User logged out:", userId);

  res.json({ success: true });
};