import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.svg";

export default function Navigation() {
    return (
        <nav className="navigation">
            <div className="nav-container container">
                <a href="https://edensway.in/" target="_blank">
                    <img src={Logo} className="logo-img" alt="Website Logo" />
                </a>

                <div className="ctas">
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? "btn-active" : "button")}>
                        BMI
                    </NavLink>

                    <NavLink
                        to="/body-fat"
                        className={({ isActive }) => (isActive ? "btn-active" : "button")}>
                        Body Fat
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}