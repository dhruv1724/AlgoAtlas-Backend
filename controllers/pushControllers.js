import { userTokens } from "./authControllers.js";
import { pushToGitHub } from "../utils/github.js";
import axios from "axios";

export const pushCode = async (req, res) => {
  try {
    const { userId, username, repo, slug, code, companies } = req.body;

    const token = userTokens[userId];

    if (!token) {
      return res.status(401).json({
        error: "User not authenticated"
      });
    }

    console.log("🚀 Backend pushing:", slug);
    console.log("📦 Companies:", companies);

    // same sanitize logic as frontend
    const sanitizedCompanies = companies.map(c =>
      c.trim()
        .toLowerCase()
        .replace(/[^a-z0-9\-]/g, "-")
        .replace(/-+/g, "-")
    );

    for (const company of sanitizedCompanies) {
      const path = `${company}/${slug}.txt`;
      console.log("📁 Path:", path);

      await pushToGitHub({
        token,
        username,
        repo,
        path,
        content: code
      });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("❌ Push Error:", err.response?.data || err.message);

    res.status(500).json({
      error: err.response?.data || "Push failed"
    });
  }
}; 

export const checkRepo = async (req, res) => {
  const { userId, repo } = req.query;

  const token = userTokens[userId];

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const response = await axios.get(
      `https://api.github.com/user/repos`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const repos = response.data.map(r => r.name);

    if (repos.includes(repo)) {
      return res.json({ exists: true });
    } else {
      return res.status(404).json({ error: "Repo not found" });
    }

  } catch (err) {
    return res.status(500).json({ error: "GitHub API error" });
  }
};