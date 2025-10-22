const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON parsing and logging
app.use(express.json());
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Helper function to load mock data
function loadMockData(filename) {
  try {
    const filePath = path.join(__dirname, "data", filename);
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading mock data from ${filename}:`, error.message);
    return [];
  }
}

// Health check endpoint for Docker health checks
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime() 
  });
});

// API endpoint: Get comments for a specific post
app.get("/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;
  
  // Check for invalid postId format
  const postIdNum = parseInt(postId, 10);
  if (isNaN(postIdNum) || postId === "invalid") {
    return res.status(404).json({ 
      error: "Invalid post ID format",
      message: "Post ID must be a valid number",
      providedValue: postId
    });
  }
  
  const comments = loadMockData("comments.json");
  
  // Filter comments by postId
  const postComments = comments.filter(comment => comment.postId === postIdNum);
  
  if (postComments.length === 0) {
    return res.status(404).json({ 
      error: "No comments found for this post",
      message: `Post ${postIdNum} does not exist or has no comments`,
      postId: postIdNum
    });
  }
  
  res.status(200).json(postComments);
});

// API endpoint: Get photos for a specific album
app.get("/albums/:albumId/photos", (req, res) => {
  const { albumId } = req.params;
  const photos = loadMockData("photos.json");
  
  // Filter photos by albumId
  const albumPhotos = photos.filter(photo => photo.albumId === parseInt(albumId, 10));
  
  if (albumPhotos.length === 0) {
    return res.status(404).json({ 
      error: "No photos found for this album",
      albumId: parseInt(albumId, 10)
    });
  }
  
  res.status(200).json(albumPhotos);
});

// API endpoint: Get albums for a specific user
app.get("/users/:userId/albums", (req, res) => {
  const { userId } = req.params;
  const albums = loadMockData("albums.json");
  
  // Filter albums by userId
  const userAlbums = albums.filter(album => album.userId === parseInt(userId, 10));
  
  if (userAlbums.length === 0) {
    return res.status(404).json({ 
      error: "No albums found for this user",
      userId: parseInt(userId, 10)
    });
  }
  
  res.status(200).json(userAlbums);
});

// API endpoint: Get todos for a specific user
app.get("/users/:userId/todos", (req, res) => {
  const { userId } = req.params;
  const todos = loadMockData("todos.json");
  
  // Filter todos by userId
  const userTodos = todos.filter(todo => todo.userId === parseInt(userId, 10));
  
  if (userTodos.length === 0) {
    return res.status(404).json({ 
      error: "No todos found for this user",
      userId: parseInt(userId, 10)
    });
  }
  
  res.status(200).json(userTodos);
});

// API endpoint: Get posts for a specific user
app.get("/users/:userId/posts", (req, res) => {
  const { userId } = req.params;
  const posts = loadMockData("posts.json");
  
  // Filter posts by userId
  const userPosts = posts.filter(post => post.userId === parseInt(userId, 10));
  
  if (userPosts.length === 0) {
    return res.status(404).json({ 
      error: "No posts found for this user",
      userId: parseInt(userId, 10)
    });
  }
  
  res.status(200).json(userPosts);
});

// 404 handler for unmatched routes
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Endpoint not found",
    path: req.originalUrl,
    availableEndpoints: [
      "GET /posts/:postId/comments",
      "GET /albums/:albumId/photos", 
      "GET /users/:userId/albums",
      "GET /users/:userId/todos",
      "GET /users/:userId/posts",
      "GET /health"
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({ 
    error: "Internal server error",
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[${new Date().toISOString()}] Fake API server running on port ${PORT}`);
  console.log("Available endpoints:");
  console.log("  GET /posts/1/comments");
  console.log("  GET /albums/1/photos");
  console.log("  GET /users/1/albums");
  console.log("  GET /users/1/todos");
  console.log("  GET /users/1/posts");
  console.log("  GET /health");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down gracefully");
  process.exit(0);
});