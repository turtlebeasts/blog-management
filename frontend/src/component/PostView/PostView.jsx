import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./postView.css";
import EditPostModal from "../EditPostModal/EditPostModal";
import DeletePostModal from "../DeletePostModal/DeletePostModal";

export default function PostView() {
  const isLoggedIn = localStorage.getItem("token") !== null;
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Error fetching post:", error));
  }, [id]);

  if (!post) {
    return <p>Loading post...</p>;
  }

  return (
    <div className="post-view-container">
      <h2>{post.title}</h2>
      {post.image && (
        <img
          src={`http://localhost:5000/uploads/${post.image}`}
          alt={post.title}
          className="post-image"
        />
      )}
      <p className="post-content">{post.content}</p>
      <p className="post-author">By {post.author || "Unknown"}</p>

      {isLoggedIn && (
        <button className="edit-btn" onClick={() => setEditModalOpen(true)}>
          Edit
        </button>
      )}
      {isLoggedIn && (
        <button className="delete-btn" onClick={() => setDeleteModalOpen(true)}>
          Delete
        </button>
      )}

      {/* Separate Modals */}
      {editModalOpen && (
        <EditPostModal
          post={post}
          closeModal={() => setEditModalOpen(false)}
          setPost={setPost}
        />
      )}
      {deleteModalOpen && (
        <DeletePostModal
          postId={id}
          closeModal={() => setDeleteModalOpen(false)}
          navigate={navigate}
        />
      )}
    </div>
  );
}
