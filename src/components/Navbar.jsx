import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <div>
        <h1>EventHub</h1>

        <div>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}
