import { Link } from "react-router-dom";
import "../styles/landing.css";

export const Header = () => {
  return (
    <header className="header">
      <div className="logo">QamCore AI</div>

      <nav className="nav">
        <a href="https://v0-qamcoretest.vercel.app/" target="_blank" rel="noopener noreferrer" className="nav-link">О нас</a>
        <Link to="/register" className="nav-link">Регистрация</Link>
        <Link to="/login" className="nav-button" aria-label="Войти в систему">
          <span>Войти</span>
        </Link>
      </nav>
    </header>
  );
};
