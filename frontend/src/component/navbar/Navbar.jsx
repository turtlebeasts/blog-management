import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Convert back to object
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Bloggy</h1>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        {user ? (
          <>
            <span className="username">👤 {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="signup-btn">
              Signup
            </Link>
          </>
        )}
      </div>

      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖" : "☰"}
      </div>
    </nav>
  );
}
