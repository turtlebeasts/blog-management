import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./landingPage.css";

export default function LandingPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/posts/all") // Fetch all posts
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  return (
    <div className="landing-container">
      <h1>Explore Latest Blog Posts</h1>
      <div className="post-grid">
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <Link to={`/view/${post.id}`} key={post.id} className="post-card">
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
                <p className="post-author">
                  By {post.author} ({post.author_email})
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
