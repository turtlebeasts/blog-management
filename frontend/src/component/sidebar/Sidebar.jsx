import { Link } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/dashboard/create">Create Blog Post</Link>
        </li>
        <li>
          <Link to="/dashboard/view">View Blog Posts</Link>
        </li>
      </ul>
    </div>
  );
}
