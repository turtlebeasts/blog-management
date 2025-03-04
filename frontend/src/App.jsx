import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/navbar/Navbar";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Dashboard from "./pages/dashboard/dashboard";
import CreatePost from "./component/CreatePost/CreatePost";
import PostList from "./component/PostList/PostList";
import PostView from "./component/PostView/PostView";
import LandingPage from "./pages/landingPage/LandingPage";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/view/:id" element={<PostView />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<h1>Welcome user</h1>} />
          <Route path="create" element={<CreatePost />} />
          <Route path="view" element={<PostList />} />
          <Route path="view/:id" element={<PostView />} />
        </Route>
      </Routes>
    </Router>
  );
}
