import { NavLink } from "react-router-dom";
import logo from "../assets/logo_sm.svg";
import { useState, useEffect } from "react";

export default function Navigation() {

    const [menu, setMenu] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMenu(true);
            } else {
                setMenu(false);
            }
        };

        handleResize(); // run once on mount

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLinkClick = () => {
        if (window.innerWidth <= 768) {
            setMenu(false);
        }
    };

    return (
        <nav className="navigation">
            <div className="nav-container container">

                <div className="logo-section">
                    <a href="https://edensway.in/" target="_blank">
                        <img src={logo} className="logo-img" alt="Website Logo" />
                    </a>
                    <h1 className="heading-1 title">Body Measurement<span className="version-number body">(Beta v0.4)</span></h1>
                </div>

                <div className={`ctas ${menu ? "" : "display-none"}`}>
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? "button" : "btn-unactive")}
                        onClick={handleLinkClick}>
                        BMI
                    </NavLink>
                    <NavLink
                        to="/bmr"
                        className={({ isActive }) => (isActive ? "button" : "btn-unactive")}
                        onClick={handleLinkClick}>
                        BMR
                    </NavLink>
                    <NavLink
                        to="/body-comp"
                        className={({ isActive }) => (isActive ? "button" : "btn-unactive")}
                        onClick={handleLinkClick}>
                        Body Composition
                    </NavLink>
                </div>

                <button
                    type="button"
                    className="menu-button button body"
                    onClick={() => setMenu(!menu)}>
                    <i className={`fa-solid ${menu ? "fa-xmark" : "fa-bars"}`}></i>
                </button>

            </div>
        </nav>
    );
}