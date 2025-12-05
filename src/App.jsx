import "./styles/app.css";
import Navigation from "./Components/Navigation";

import BodyFat from "./pages/BodyFat";
import BMI from "./pages/BMI";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className='main-container'>
      <Navigation />

      <Routes>
        <Route path="/" element={<BMI />} />
        <Route path="/body-fat" element={<BodyFat />} />
      </Routes>
    </div>
  );
}

export default App;