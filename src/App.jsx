import { useEffect, useState } from "react";

import "./styles/app.css";
import Navigation from "./components/Navigation";

// import Home from "./pages/Home";
import BodyComposition from "./pages/BodyComposition";
import BMI from "./pages/BMI";
import BMR from "./pages/BMR";

import { Routes, Route } from "react-router-dom";

function App() {

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  return (
    <div className='main-container'>
      <Navigation />

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<BMI />} />
        <Route path="/bmr" element={<BMR />} />
        <Route path="/body-comp" element={<BodyComposition />} />
      </Routes>

      {showInstall && (
        <div className="install-popup">
          <button className="button body" onClick={handleInstall}>Add to Home Screen</button>
          <button className="button body btn-unactive" onClick={() => setShowInstall(false)}> Not Now </button>
        </div>
      )}

    </div>
  );
}

export default App;