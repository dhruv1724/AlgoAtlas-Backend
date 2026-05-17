import axios from "axios";

const BRANCH = "main";

function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
  return Buffer.from(binary, "binary").toString("base64");
}

export const pushToGitHub = async ({
  token,
  username,
  repo,
  path,
  content
}) => {
  const url = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;

  console.log(" Backend pushing to:", url);

  let sha = undefined;

  // 🔍 Step 1: Check if file exists
  try {
    const checkRes = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    sha = checkRes.data.sha;
    console.log(" File exists, updating. SHA:", sha);

  } catch (err) {
    if (err.response?.status === 404) {
      console.log(" File does not exist, creating new.");
    } else {
      console.error("❌ Error checking file:", err.response?.data);
      throw err;
    }
  }

  //  Step 2: Create / Update file
  const body = {
    message: `Add/Update ${path}`,
    content: toBase64(content),
    branch: BRANCH,
    ...(sha && { sha })
  };

  try {
    const res = await axios.put(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("✅ Pushed:", path);
    return res.data;

  } catch (err) {
    console.error("❌ GitHub Push Error:", err.response?.data);
    throw err;
  }
};