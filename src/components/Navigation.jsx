import { NavLink } from "react-router-dom";
import logo from "../assets/logo_sm.svg";

export default function Navigation() {
    return (
        <nav className="navigation">
            <div className="nav-container container">

                <div className="logo-section">
                    <a href="https://edensway.in/" target="_blank">
                        <img src={logo} className="logo-img" alt="Website Logo" />
                    </a>
                    <h1 className="heading-1">Body Measurement Calculator</h1>
                </div>



                <div className="ctas">
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? "btn-active" : "button")}>
                        BMI
                    </NavLink>
                    {/* <NavLink
                        to="/bmr"
                        className={({ isActive }) => (isActive ? "btn-active" : "button")}>
                        BMR
                    </NavLink> */}
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