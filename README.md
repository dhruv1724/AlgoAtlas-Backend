# AlgoAtlas

AlgoAtlas is a Chrome Extension that automatically syncs accepted LeetCode solutions to GitHub repositories organized by company tags.

The extension detects successful submissions on LeetCode, extracts code directly from the Monaco editor, and pushes solutions to GitHub using secure GitHub OAuth authentication.

---

# Features

* Automatic detection of accepted LeetCode submissions
* Real-time Monaco editor code extraction
* GitHub OAuth authentication
* Multi-user support
* Automatic GitHub push
* Company-wise folder organization
* Repository validation before saving
* Login/logout session management

---

# Tech Stack

* JavaScript
* Chrome Extension APIs
* Node.js
* Express.js
* GitHub OAuth
* REST APIs

---

# Folder Structure

```text
leetcode-preprocessor/
│
├── extension/
├── backend/
├── scripts/
```

---

# Setup

## Backend

```bash
cd backend
npm install
npm run start
```

Create a `.env` file:

```env
PORT=3001
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
```

---

# GitHub OAuth Setup

Create a GitHub OAuth App:

### Homepage URL

```text
http://localhost:3001
```

### Callback URL

```text
http://localhost:3001/auth/github/callback
```

### Recommended Scope

```text
public_repo
```

---

# Chrome Extension Setup

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click `Load unpacked`
4. Select the `extension/` folder

---

# Workflow

1. Login with GitHub
2. Save repository
3. Submit accepted LeetCode solution
4. AlgoAtlas automatically pushes code to GitHub

---

# Example Output

```text
amazon/two-sum.txt
google/merge-intervals.txt
microsoft/lru-cache.txt
```

---

# Security

* GitHub credentials are never stored in the extension
* OAuth tokens are managed securely through backend APIs
* Uses limited `public_repo` scope for repository access

---

# Author

Dhruv Gandhi

GitHub:
[https://github.com/dhruv1724](https://github.com/dhruv1724)

Backend Repository:
