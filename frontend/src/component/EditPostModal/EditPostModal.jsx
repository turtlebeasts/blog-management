import React, { useState } from "react";

export default function EditPostModal({ post, closeModal, setPost }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleUpdate = () => {
    fetch(`http://localhost:5000/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => res.json())
      .then(() => {
        setPost({ ...post, title, content });
        closeModal();
      })
      .catch((err) => console.error("Error updating post:", err));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Post</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleUpdate}>Update</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}
