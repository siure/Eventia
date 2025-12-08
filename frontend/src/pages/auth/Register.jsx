import { Link } from "react-router-dom";


export default function Register() {
  return (
    <div
      style={{
        height: "100vh", // full viewport height
        width: "100vw", // full viewport width
        margin: 0,
        backgroundImage:
          "url('https://media.licdn.com/dms/image/v2/D5612AQFeW9nUjd0pTw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1706895132692?e=2147483647&v=beta&t=8lRDNyevKL2wHg4R7Qdjj5E2jLPKsCe6suWpqBHDs6U')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
  
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          Register
        </h2>

        <form>
          <label>Name</label>
          <input
            type="text"
            style={{
              width: "100%",
              marginTop: "5px",
              marginBottom: "15px",
              padding: "10px",
            }}
          />

          <label>Email</label>
          <input
            type="email"
            style={{
              width: "100%",
              marginTop: "5px",
              marginBottom: "15px",
              padding: "10px",
            }}
          />

          <label>Password</label>
          <input
            type="password"
            style={{
              width: "100%",
              marginTop: "5px",
              marginBottom: "15px",
              padding: "10px",
            }}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            style={{
              width: "100%",
              marginTop: "5px",
              marginBottom: "20px",
              padding: "10px",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#333",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}



