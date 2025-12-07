import "./styles/app.css";
import Navigation from "./components/Navigation";

// import Home from "./pages/Home";
import BodyFat from "./pages/BodyFat";
import BMI from "./pages/BMI";
import BMR from "./pages/BMR";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className='main-container'>
      <Navigation />

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<BMI />} />
        <Route path="/bmr" element={<BMR />} />
        <Route path="/body-fat" element={<BodyFat />} />
      </Routes>
    </div>
  );
}

export default App;