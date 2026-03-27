import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react";

export default function Navbar() {
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">DevLog</Link>
            <div className="nav-links">
                <Link to="/#features">Features</Link>
                <Link to="/#projects">Projects</Link>
                {isLoggedIn && user ? (
                    <div className="user-nav-group">
                        <Link to="/mypage" className="user-nickname">{user?.nickname}님</Link>
                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/signin" className="login-link">Login</Link>
                )}
            </div>
        </nav>
    );
}