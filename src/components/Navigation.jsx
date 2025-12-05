import Logo from "../assets/Logo.svg"

export default function Navigation() {
    return (
        <div className="navigation">
            <div className="nav-container container">
                <a href="https://edensway.in/" target="_blank">
                    <img src={Logo} className="logo-img" alt="Website Logo" srcset="" />
                </a>
                <div className="title">
                    <h1 id="dynamic-title" className="heading-1">Body Fat Calculator</h1>
                    <p className="body">(for Men & Female)</p>
                </div>
            </div>
        </div>
    )
}