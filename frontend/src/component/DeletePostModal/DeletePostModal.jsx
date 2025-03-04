import React from "react";

export default function DeletePostModal({ postId, closeModal, navigate }) {
  const handleDelete = () => {
    fetch(`http://localhost:5000/api/posts/${postId}`, { method: "DELETE" })
      .then(() => navigate("/dashboard/view")) // Redirect to post list
      .catch((err) => console.error("Error deleting post:", err));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Are you sure you want to delete this post?</h2>
        <button onClick={handleDelete}>Yes, Delete</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}
