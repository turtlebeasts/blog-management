import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./postList.css";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/posts?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, [user]);

  return (
    <div className="post-list-container">
      <h2>Latest Blog Posts</h2>
      <div className="post-grid">
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <Link
              to={`/dashboard/view/${post.id}`}
              key={post.id}
              className="post-card"
            >
              {post.image && (
                <img
                  src={`http://localhost:5000/uploads/${post.image}`}
                  alt={post.title}
                  className="post-image"
                />
              )}
              <div className="post-content">
                <h3>{post.title}</h3>
                <p className="post-description">
                  {post.content.substring(0, 100)}...
                </p>
                <p className="post-author">By {post.author || "Unknown"}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
