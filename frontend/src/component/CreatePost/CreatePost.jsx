import React, { useState } from "react";
import "./createPost.css";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Preview image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in to create a post.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Send token in headers
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Post created successfully!");
        setTitle("");
        setContent("");
        setImage(null);
        setPreview(null);
      } else {
        setMessage(data.error || "Failed to create post.");
      }
    } catch (error) {
      setMessage("Error creating post.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="create-post-container">
      <h2>Create Blog Post</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Blog Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
          required
        />

        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog content here..."
          required
        ></textarea>

        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <img src={preview} alt="Preview" className="image-preview" />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
