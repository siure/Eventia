import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div>
      <div>
        <h2>Create Account</h2>

        <form>
          <div>
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" />
          </div>

          <div>
            <label>Email</label>
            <input type="email" placeholder="example@email.com" />
          </div>

          <div>
            <label>Password</label>
            <input type="password" />
          </div>

          <div>
            <label>Confirm Password</label>
            <input type="password" />
          </div>

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
