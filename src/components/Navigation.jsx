import { Link } from "react-router-dom";
import Logo from "../assets/Logo.svg"

export default function Navigation() {
    return (
        <nav className="navigation">
            <div className="nav-container container">
                <a href="https://edensway.in/" target="_blank">
                    <img src={Logo} className="logo-img" alt="Website Logo" srcset="" />
                </a>
                <div className="ctas">
                    <Link to="/" className="button" href="#">BMI</Link>
                    <Link to="/body-fat" className="button" href="#">Body Fat</Link>
                </div>
            </div>
        </nav>
    )
}