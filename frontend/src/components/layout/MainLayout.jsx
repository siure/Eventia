import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout } from "../../services/auth";

export default function MainLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    // Get user name from localStorage
    if (token) {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserName(user.name || "Account");
        } catch (error) {
          setUserName("Account");
        }
      } else {
        setUserName("Account");
      }
    } else {
      setUserName("");
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserName("");
    navigate("/events");
  };

  useEffect(() => {
    // Check authentication on mount and route changes
    checkAuth();

    // Listen for storage changes (e.g., when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    // Custom event listener for same-tab login/logout
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
  }, [location.pathname]);

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-title">
            EVENTIA
          </Link>

          <nav className="navbar-right">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="btn btn-primary navbar-account-btn">
                  {userName || "Account"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn navbar-account-btn"
                  style={{
                    borderColor: "#fb7185",
                    color: "#fb7185",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(251, 113, 133, 0.12)";
                    e.currentTarget.style.borderColor = "#fca5a5";
                    e.currentTarget.style.color = "#fca5a5";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(251, 113, 133, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "#fb7185";
                    e.currentTarget.style.color = "#fb7185";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary navbar-login-btn">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/*centrage global */}
      <main className="app-container">
        <div className="page-section">
          <Outlet />
        </div>
      </main>
    </>
  );
}
