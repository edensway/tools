import "./styles/app.css";
import Navigation from "./components/Navigation";

// import Home from "./pages/Home";
import BodyComposition from "./pages/BodyComposition";
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
        <Route path="/body-comp" element={<BodyComposition />} />
      </Routes>
    </div>
  );
}

export default App;