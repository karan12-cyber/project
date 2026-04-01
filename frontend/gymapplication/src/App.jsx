import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import RagnarokFitnessHome from './pages/RagnarokFitnessHome.jsx'
import LoginPage from "./pages/LoginPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RagnarokFitnessHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;