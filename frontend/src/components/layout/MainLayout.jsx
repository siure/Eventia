import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout } from "../../services/auth";
import "../../styles/components/MainLayout.css";

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
                  className="btn navbar-account-btn navbar-logout-btn"
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
