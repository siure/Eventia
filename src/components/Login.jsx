import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div>
      <div>
        <h2>Login</h2>

        <form>
          <div>
            <label>Email</label>
            <input type="email" placeholder="example@email.com" />
          </div>

          <div>
            <label>Password</label>
            <input type="password" />
          </div>

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
